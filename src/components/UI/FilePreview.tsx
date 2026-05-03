import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Document, Page, pdfjs } from "react-pdf";
import * as XLSX from "xlsx";
import { renderAsync } from "docx-preview";
import { PPTXViewer } from "pptxviewjs";
import JSZip from "jszip";
import Chart from "chart.js/auto";
import { useFileDownloader } from "../../hooks/useFileDownloader";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

if (typeof window !== "undefined") {
  (window as unknown as { JSZip?: typeof JSZip }).JSZip = JSZip;
  (window as unknown as { Chart?: typeof Chart }).Chart = Chart;
}

/* ─── Types ─────────────────────────────────────────────── */
type FilePreviewProps = {
  fileId: string;
  className?: string;
};

type FileType =
  | "image"
  | "video"
  | "pdf"
  | "word"
  | "excel"
  | "powerpoint"
  | "unknown";

type FileInfo = {
  fileName: string;
  remoteUrl: string;
  objectUrl: string;
  blob: Blob;
};

/* ─── Helpers ────────────────────────────────────────────── */
const getFileExtension = (fileName: string) => {
  const clean = fileName.split(/[?#]/)[0];
  const idx = clean.lastIndexOf(".");
  return idx < 0 ? "" : clean.slice(idx + 1).toLowerCase();
};

const getFileType = (fileName: string): FileType => {
  const ext = getFileExtension(fileName);
  if (["png", "jpg", "jpeg", "gif", "webp", "bmp", "svg"].includes(ext))
    return "image";
  if (["mp4", "webm", "ogg", "mov"].includes(ext)) return "video";
  if (ext === "pdf") return "pdf";
  if (["doc", "docx"].includes(ext)) return "word";
  if (["xls", "xlsx"].includes(ext)) return "excel";
  if (["ppt", "pptx"].includes(ext)) return "powerpoint";
  return "unknown";
};

const isDocxPreviewable = (fileName: string, blob: Blob) => {
  const ext = getFileExtension(fileName);
  if (ext === "docx") return true;
  if (ext === "doc") return false;
  const mime = blob.type.toLowerCase();
  return (
    mime ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  );
};

const isPptxPreviewable = (fileName: string, blob: Blob) => {
  const ext = getFileExtension(fileName);
  if (ext === "pptx") return true;
  if (ext === "ppt") return false;
  const mime = blob.type.toLowerCase();
  return (
    mime ===
    "application/vnd.openxmlformats-officedocument.presentationml.presentation"
  );
};

const formatSize = (bytes: number) => {
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`;
  if (bytes >= 1_000) return `${Math.round(bytes / 1_000)} KB`;
  return `${bytes} B`;
};

const FILE_TYPE_LABELS: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  pdf: { label: "PDF", color: "#993C1D", bg: "#FAECE7" },
  word: { label: "DOC", color: "#185FA5", bg: "#E6F1FB" },
  excel: { label: "XLS", color: "#3B6D11", bg: "#EAF3DE" },
  powerpoint: { label: "PPT", color: "#B44A1F", bg: "#FDEEE7" },
  image: { label: "IMG", color: "#534AB7", bg: "#EEEDFE" },
  video: { label: "VID", color: "#993556", bg: "#FBEAF0" },
  unknown: { label: "FILE", color: "#5F5E5A", bg: "#F1EFE8" },
};

/* ─── Sub-components ─────────────────────────────────────── */

/** Skeleton shimmer for loading state */
const SkeletonShimmer = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
      height: "100%",
      width: "100%",
    }}
  >
    <div style={shimmerStyle({ width: 56, height: 56, borderRadius: "50%" })} />
    <div style={shimmerStyle({ width: 140, height: 12, borderRadius: 6 })} />
    <div style={shimmerStyle({ width: 90, height: 10, borderRadius: 6 })} />
    <style>{`
        @keyframes fp-shimmer { 0%,100%{opacity:.45} 50%{opacity:1} }
        `}</style>
  </div>
);

const shimmerStyle = (extra: React.CSSProperties): React.CSSProperties => ({
  background: "var(--color-background-secondary, #f0f0f0)",
  animation: "fp-shimmer 1.6s ease-in-out infinite",
  flexShrink: 0,
  ...extra,
});

/** Error state with retry button */
const ErrorState = ({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      height: "100%",
    }}
  >
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: "50%",
        background: "var(--color-background-danger, #FCEBEB)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 18,
        color: "var(--color-text-danger, #A32D2D)",
      }}
    >
      !
    </div>
    <span style={{ fontSize: 13, color: "var(--color-text-danger, #A32D2D)" }}>
      {message}
    </span>
    <button
      onClick={onRetry}
      style={{
        fontSize: 12,
        padding: "5px 14px",
        borderRadius: 8,
        cursor: "pointer",
        border: "0.5px solid var(--color-border-danger, #F09595)",
        color: "var(--color-text-danger, #A32D2D)",
        background: "transparent",
      }}
    >
      Thử lại
    </button>
  </div>
);

/** Toolbar shown above all file types */
const Toolbar = ({
  fileType,
  fileName,
  fileSize,
  onDownload,
  onFullscreen,
}: {
  fileType: FileType;
  fileName: string;
  fileSize?: string;
  onDownload?: () => void;
  onFullscreen?: () => void;
}) => {
  const meta = FILE_TYPE_LABELS[fileType] ?? FILE_TYPE_LABELS.unknown;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 14px",
        borderBottom:
          "0.5px solid var(--color-border-tertiary, rgba(0,0,0,.1))",
        background: "var(--color-background-secondary, #f7f7f7)",
      }}
    >
      {/* Type badge */}
      <span
        style={{
          fontSize: 10,
          fontWeight: 600,
          padding: "3px 7px",
          borderRadius: 20,
          flexShrink: 0,
          color: meta.color,
          background: meta.bg,
        }}
      >
        {meta.label}
      </span>

      {/* File name */}
      <span
        style={{
          fontSize: 13,
          fontWeight: 500,
          flex: 1,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          color: "var(--color-text-primary, #1a1a1a)",
        }}
      >
        {fileName}
      </span>

      {/* File size */}
      {fileSize && (
        <span
          style={{
            fontSize: 11,
            color: "var(--color-text-secondary, #888)",
            flexShrink: 0,
          }}
        >
          {fileSize}
        </span>
      )}

      {/* Action buttons */}
      {onDownload && (
        <IconButton title="Tải về" onClick={onDownload}>
          <DownloadIcon />
        </IconButton>
      )}
      {onFullscreen && (
        <IconButton title="Toàn màn hình" onClick={onFullscreen}>
          <FullscreenIcon />
        </IconButton>
      )}
    </div>
  );
};

const IconButton = ({
  children,
  title,
  onClick,
}: {
  children: React.ReactNode;
  title: string;
  onClick?: () => void;
}) => (
  <button
    title={title}
    onClick={onClick}
    style={{
      width: 28,
      height: 28,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 8,
      flexShrink: 0,
      border: "0.5px solid var(--color-border-secondary, rgba(0,0,0,.2))",
      background: "transparent",
      cursor: "pointer",
      color: "var(--color-text-secondary, #666)",
    }}
    onMouseEnter={(e) =>
      (e.currentTarget.style.background =
        "var(--color-background-tertiary, #eee)")
    }
    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
  >
    {children}
  </button>
);

const DownloadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path
      d="M7 1v8M4 6l3 3 3-3M2 11h10"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const FullscreenIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path
      d="M1 5V1h4M9 1h4v4M13 9v4H9M5 13H1V9"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** PDF viewer with page nav + zoom */
const PdfViewer = ({ url, onError }: { url: string; onError: () => void }) => {
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(1.0);
  const [pageWidth, setPageWidth] = useState(760);
  const pageAreaRef = useRef<HTMLDivElement | null>(null);

  // Cập nhật chiều rộng khi container thay đổi kích thước
  useEffect(() => {
    if (!pageAreaRef.current) return;

    const updateWidth = () => {
      const containerWidth = pageAreaRef.current?.clientWidth ?? 800;
      const newWidth = Math.max(320, Math.min(1000, containerWidth - 48));
      setPageWidth(newWidth);
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(pageAreaRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* Khu vực hiển thị PDF */}
      <div
        ref={pageAreaRef}
        style={{
          flex: 1,
          overflow: "auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "24px 16px",
          background: "var(--color-background-tertiary, #f0f0f0)",
        }}
      >
        <Document
          file={url}
          loading={<SkeletonShimmer />}
          error={
            <ErrorState message="Không thể xem trước PDF" onRetry={onError} />
          }
          onLoadSuccess={({ numPages: n }) => {
            setNumPages(n);
            setCurrentPage(1);
          }}
        >
          <Page
            pageNumber={currentPage}
            width={pageWidth}
            scale={zoom}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        </Document>
      </div>

      {/* Footer controls */}
      {numPages > 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 18px",
            borderTop:
              "0.5px solid var(--color-border-tertiary, rgba(0,0,0,.14))",
            background: "var(--color-background-secondary, #f7f7f7)",
            fontSize: 13,
            flexShrink: 0,
            justifyContent: "center",
          }}
        >
          {/* Page Navigation */}
          <NavButton
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            ‹
          </NavButton>

          <span
            style={{
              minWidth: 72,
              textAlign: "center",
              fontWeight: 500,
              color: "var(--color-text-primary, #1a1a1a)",
            }}
          >
            {currentPage} / {numPages}
          </span>

          <NavButton
            disabled={currentPage >= numPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            ›
          </NavButton>

          <div style={{ flex: 1, minWidth: 20 }} />

          {/* Zoom Controls */}
          <span
            style={{
              marginRight: 6,
              color: "var(--color-text-secondary, #666)",
            }}
          >
            Zoom:
          </span>

          <NavButton
            disabled={zoom <= 0.5}
            onClick={() =>
              setZoom((z) => Math.max(0.5, +(z - 0.25).toFixed(2)))
            }
          >
            −
          </NavButton>

          <span
            style={{
              minWidth: 48,
              textAlign: "center",
              fontWeight: 500,
            }}
          >
            {Math.round(zoom * 100)}%
          </span>

          <NavButton
            disabled={zoom >= 3.0}
            onClick={() =>
              setZoom((z) => Math.min(3.0, +(z + 0.25).toFixed(2)))
            }
          >
            +
          </NavButton>
        </div>
      )}
    </div>
  );
};

/** Word viewer with docx-preview */
const WordViewer = ({ blob, onError }: { blob: Blob; onError: () => void }) => {
  const [loading, setLoading] = useState(true);
  const docxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;

    const renderWord = async () => {
      if (!docxRef.current) return;

      try {
        setLoading(true);
        docxRef.current.innerHTML = "";

        // Đảm bảo luôn truyền ArrayBuffer (an toàn nhất)
        const arrayBuffer = await blob.arrayBuffer();

        await renderAsync(arrayBuffer, docxRef.current, undefined, {
          className: "docx-preview",
          inWrapper: true,
          ignoreWidth: false,
          ignoreHeight: false,
        });
      } catch (err) {
        console.error("Word render error:", err);
        if (!cancelled) onError();
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    renderWord();

    return () => {
      cancelled = true;
      if (docxRef.current) docxRef.current.innerHTML = "";
    };
  }, [blob, onError]);

  return (
    <div
      style={{
        position: "relative",
        flex: 1,
        overflow: "auto",
        background: "var(--color-background-primary, #fff)",
      }}
    >
      <div
        ref={docxRef}
        style={{
          minHeight: 200,
          background: "var(--color-background-primary, #fff)",
          padding: 16,
        }}
      />
      {loading && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--fp-overlay-bg, rgba(255,255,255,0.9))",
          }}
        >
          <SkeletonShimmer />
        </div>
      )}
    </div>
  );
};

const PptViewer = ({ blob, onError }: { blob: Blob; onError: () => void }) => {
  const [loading, setLoading] = useState(true);
  const [slideCount, setSlideCount] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(1);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const viewerRef = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;

    const initViewer = async () => {
      if (!canvasRef.current) return;

      try {
        setLoading(true);

        const viewer = new PPTXViewer({
          canvas: canvasRef.current,
          autoExposeGlobals: true,
          slideSizeMode: "fit",
          backgroundColor: "#ffffff",
        });
        viewerRef.current = viewer;

        const buf = await blob.arrayBuffer();
        if (cancelled) return;

        await viewer.loadFile(buf);
        if (cancelled) return;

        const total = viewer.getSlideCount();
        setSlideCount(total || 0);
        setCurrentSlide(1);
        await viewer.render(canvasRef.current, { slideIndex: 0 });
      } catch (err) {
        console.error("PPTXViewer Error:", err);
        if (!cancelled) onError();
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    initViewer();

    return () => {
      cancelled = true;
      if (viewerRef.current) {
        viewerRef.current.destroy?.();
        viewerRef.current = null;
      }
    };
  }, [blob, onError]);

  // Chuyển slide
  useEffect(() => {
    if (!viewerRef.current || slideCount === 0) return;

    const renderCurrentSlide = async () => {
      try {
        const target = Math.max(0, Math.min(slideCount - 1, currentSlide - 1));
        await viewerRef.current.render(canvasRef.current, {
          slideIndex: target,
        });
      } catch (err) {
        console.error(err);
        onError();
      }
    };

    renderCurrentSlide();
  }, [currentSlide, slideCount, onError]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div
        style={{
          flex: 1,
          overflow: "auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "16px",
          background: "var(--color-background-tertiary, #f0f0f0)",
          position: "relative",
        }}
      >
        <canvas
          ref={canvasRef}
          width={960}
          height={540}
          style={{
            maxWidth: "100%",
            height: "auto",
            borderRadius: 12,
            background: "#ffffff",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            imageRendering: "crisp-edges",
          }}
        />

        {loading && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "var(--fp-overlay-bg, rgba(255, 255, 255, 0.9))",
              zIndex: 10,
            }}
          >
            <SkeletonShimmer />
          </div>
        )}
      </div>

      {slideCount > 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            justifyContent: "center",
            padding: "10px 14px",
            borderTop:
              "0.5px solid var(--color-border-tertiary, rgba(0,0,0,.14))",
            background: "var(--color-background-secondary, #f7f7f7)",
            fontSize: 12,
            color: "var(--color-text-secondary, #666)",
            flexShrink: 0,
          }}
        >
          <NavButton
            disabled={currentSlide <= 1}
            onClick={() => setCurrentSlide((p) => p - 1)}
          >
            ‹
          </NavButton>
          <span
            style={{
              minWidth: 68,
              textAlign: "center",
              color: "var(--color-text-primary, #1a1a1a)",
            }}
          >
            {currentSlide} / {slideCount}
          </span>
          <NavButton
            disabled={currentSlide >= slideCount}
            onClick={() => setCurrentSlide((p) => p + 1)}
          >
            ›
          </NavButton>

          <div style={{ flex: 1 }} />

          {/* Tạm thời tắt zoom để test slide có hiện không */}
          {/* Nếu slide đã hiện chữ/hình thì mở lại sau */}
          {/* <span>Zoom:</span> ... */}
        </div>
      )}
    </div>
  );
};

const NavButton = ({
  children,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      width: 24,
      height: 24,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 6,
      flexShrink: 0,
      border: "0.5px solid var(--color-border-secondary, rgba(0,0,0,.2))",
      background: "transparent",
      cursor: disabled ? "default" : "pointer",
      color: disabled
        ? "var(--color-text-tertiary, #aaa)"
        : "var(--color-text-secondary, #666)",
      fontSize: 14,
    }}
  >
    {children}
  </button>
);

/** Excel viewer with multi-sheet tabs */
const ExcelViewer = ({
  blob,
  onError,
}: {
  blob: Blob;
  onError: () => void;
}) => {
  const [workbook, setWorkbook] = useState<XLSX.WorkBook | null>(null);
  const [activeSheet, setActiveSheet] = useState<string>("");
  const [html, setHtml] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const buf = await blob.arrayBuffer();
        if (cancelled) return;
        const wb = XLSX.read(buf, { type: "array" });
        if (cancelled) return;
        const firstSheet = wb.SheetNames[0] ?? "";
        setWorkbook(wb);
        setActiveSheet(firstSheet);
        setHtml(
          XLSX.utils.sheet_to_html(wb.Sheets[firstSheet], { id: "fp-excel" }),
        );
      } catch {
        if (!cancelled) onError();
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [blob]);

  const switchSheet = (name: string) => {
    if (!workbook) return;
    setActiveSheet(name);
    setHtml(
      XLSX.utils.sheet_to_html(workbook.Sheets[name], { id: "fp-excel" }),
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Sheet tabs */}
      {workbook && workbook.SheetNames.length > 1 && (
        <div
          style={{
            display: "flex",
            gap: 4,
            padding: "7px 12px",
            flexWrap: "wrap",
            borderBottom:
              "0.5px solid var(--color-border-tertiary, rgba(0,0,0,.1))",
            background: "var(--color-background-secondary, #f7f7f7)",
          }}
        >
          {workbook.SheetNames.map((name) => (
            <button
              key={name}
              onClick={() => switchSheet(name)}
              style={{
                padding: "4px 12px",
                fontSize: 12,
                borderRadius: 8,
                cursor: "pointer",
                transition: "all 0.15s",
                border:
                  "0.5px solid var(--color-border-tertiary, rgba(0,0,0,.1))",
                background:
                  activeSheet === name
                    ? "var(--color-background-primary, #fff)"
                    : "transparent",
                color:
                  activeSheet === name
                    ? "var(--color-text-primary, #1a1a1a)"
                    : "var(--color-text-secondary, #666)",
                fontWeight: activeSheet === name ? 500 : 400,
              }}
            >
              {name}
            </button>
          ))}
        </div>
      )}

      {/* Table area */}
      <div
        style={{
          flex: 1,
          overflow: "auto",
          padding: 0,
          background: "var(--color-background-primary, #fff)",
        }}
      >
        {loading ? (
          <SkeletonShimmer />
        ) : (
          <>
            <style>{`
                #fp-excel { border-collapse: collapse; font-size: 12px; width: 100%; }
                #fp-excel th {
                    background: var(--color-background-secondary, #f7f7f7);
                    padding: 5px 10px;
                    border: 0.5px solid var(--color-border-tertiary, rgba(0,0,0,.1));
                    font-weight: 500;
                    position: sticky; top: 0;
                    color: var(--color-text-primary, #1a1a1a);
                    white-space: nowrap;
                }
                #fp-excel td {
                    padding: 4px 10px;
                    border: 0.5px solid var(--color-border-tertiary, rgba(0,0,0,.1));
                    color: var(--color-text-primary, #1a1a1a);
                    white-space: nowrap;
                }
                #fp-excel tr:hover td {
                    background: var(--color-background-secondary, #f7f7f7);
                }
                `}</style>
            <div dangerouslySetInnerHTML={{ __html: html }} />
          </>
        )}
      </div>
    </div>
  );
};

/** Image viewer with checkerboard bg for transparency */
const ImageViewer = ({ url, alt }: { url: string; alt: string }) => (
  <div
    style={{
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--fp-checker-base, #f8f8f8)",
      backgroundImage: `
        linear-gradient(45deg, var(--fp-checker-accent, #e0e0e0) 25%, transparent 25%),
        linear-gradient(-45deg, var(--fp-checker-accent, #e0e0e0) 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, var(--fp-checker-accent, #e0e0e0) 75%),
        linear-gradient(-45deg, transparent 75%, var(--fp-checker-accent, #e0e0e0) 75%)
        `,
      backgroundSize: "16px 16px",
      backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px",
      minHeight: 200,
    }}
  >
    <img
      src={url}
      alt={alt}
      style={{ maxHeight: 480, maxWidth: "100%", objectFit: "contain" }}
    />
  </div>
);

const OfficeOnlinePreview = ({
  url,
  title,
}: {
  url: string;
  title: string;
}) => (
  <iframe
    title={title}
    src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`}
    style={{
      width: "100%",
      height: 540,
      border: 0,
      background: "var(--fp-iframe-bg, #fff)",
    }}
  />
);

/* ─── Main Component ─────────────────────────────────────── */
const FilePreview: React.FC<FilePreviewProps> = ({ fileId, className }) => {
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [excelError, setExcelError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof document === "undefined") {
      return false;
    }
    return document.documentElement.classList.contains("dark");
  });
  const [wordError, setWordError] = useState<string | null>(null);
  const [pptError, setPptError] = useState<string | null>(null);
  const { getFileInfo, getFileBlob } = useFileDownloader();

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://cdn.jsdelivr.net/npm/docx-preview@latest/dist/docx-preview.css";
    document.head.appendChild(link);

    return () => {
      try {
        document.head.removeChild(link);
      } catch {}
    };
  }, []);

  const fetchFile = useCallback(async () => {
    let objectUrl: string | null = null;

    try {
      setIsLoading(true);
      setError(null);
      setExcelError(null);
      setWordError(null);
      setPptError(null);

      const [info, blob] = await Promise.all([
        getFileInfo(fileId),
        getFileBlob(fileId),
      ]);
      if (!info || !blob) throw new Error("No file info or blob");

      objectUrl = URL.createObjectURL(blob);
      setFileInfo({
        fileName: info.fileName,
        remoteUrl: info.url,
        objectUrl,
        blob,
      });
    } catch {
      setError("Không thể tải file");
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    } finally {
      setIsLoading(false);
    }
  }, [fileId, getFileBlob, getFileInfo]);

  useEffect(() => {
    fetchFile();
    return () => {
      if (fileInfo?.objectUrl) URL.revokeObjectURL(fileInfo.objectUrl);
    };
  }, [fetchFile]);

  const handleDownload = () => {
    if (!fileInfo) return;
    const a = document.createElement("a");
    a.href = fileInfo.objectUrl;
    a.download = fileInfo.fileName;
    a.click();
  };

  const themeVars = useMemo<React.CSSProperties>(() => {
    if (isDarkMode) {
      return {
        ["--color-background-primary" as any]: "#0f172a",
        ["--color-background-secondary" as any]: "#111827",
        ["--color-background-tertiary" as any]: "#1f2937",
        ["--color-border-secondary" as any]: "rgba(148, 163, 184, 0.35)",
        ["--color-border-tertiary" as any]: "rgba(148, 163, 184, 0.25)",
        ["--color-text-primary" as any]: "#e5e7eb",
        ["--color-text-secondary" as any]: "#9ca3af",
        ["--color-background-danger" as any]: "rgba(127, 29, 29, 0.35)",
        ["--color-border-danger" as any]: "rgba(248, 113, 113, 0.45)",
        ["--color-text-danger" as any]: "#fca5a5",
        ["--fp-checker-base" as any]: "#0b1220",
        ["--fp-checker-accent" as any]: "#1f2937",
        ["--fp-iframe-bg" as any]: "#111827",
        ["--fp-overlay-bg" as any]: "rgba(15, 23, 42, 0.82)",
      };
    }

    return {
      ["--color-background-primary" as any]: "#ffffff",
      ["--color-background-secondary" as any]: "#f7f7f7",
      ["--color-background-tertiary" as any]: "#f0f0f0",
      ["--color-border-secondary" as any]: "rgba(0, 0, 0, 0.2)",
      ["--color-border-tertiary" as any]: "rgba(0, 0, 0, 0.1)",
      ["--color-text-primary" as any]: "#1a1a1a",
      ["--color-text-secondary" as any]: "#666666",
      ["--color-background-danger" as any]: "#fcebeb",
      ["--color-border-danger" as any]: "#f09595",
      ["--color-text-danger" as any]: "#a32d2d",
      ["--fp-checker-base" as any]: "#f8f8f8",
      ["--fp-checker-accent" as any]: "#e0e0e0",
      ["--fp-iframe-bg" as any]: "#ffffff",
      ["--fp-overlay-bg" as any]: "rgba(255, 255, 255, 0.9)",
    };
  }, [isDarkMode]);

  /* ── Wrappers ── */
  const containerStyle: React.CSSProperties = {
    ...themeVars,
    display: "flex",
    flexDirection: "column",
    borderRadius: 12,
    border: "0.5px solid var(--color-border-tertiary, rgba(0,0,0,.1))",
    overflow: "hidden",
    background: "var(--color-background-primary, #fff)",
    maxHeight: "600px",
    ...(className ? {} : {}),
  };

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const root = document.documentElement;
    const updateTheme = () => {
      setIsDarkMode(root.classList.contains("dark"));
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(root, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const previewAreaStyle: React.CSSProperties = {
    flex: 1,
    overflow: "auto",
  };

  /* ── Loading ── */
  if (isLoading) {
    return (
      <div className={className} style={{ ...containerStyle, minHeight: 200 }}>
        <div style={{ height: 200 }}>
          <SkeletonShimmer />
        </div>
      </div>
    );
  }

  /* ── Fetch error ── */
  if (error || !fileInfo) {
    return (
      <div className={className} style={{ ...containerStyle, minHeight: 180 }}>
        <div style={{ height: 180 }}>
          <ErrorState
            message={error ?? "Không thể hiển thị file"}
            onRetry={fetchFile}
          />
        </div>
      </div>
    );
  }

  const { fileName, objectUrl, blob } = fileInfo;
  const type = getFileType(fileName);
  const fileSize = formatSize(blob.size);
  const canPreviewWord = isDocxPreviewable(fileName, blob);
  const canPreviewPowerpoint = isPptxPreviewable(fileName, blob);
  const officePreviewUrl = fileInfo.remoteUrl || "";

  /* ── Render by type ── */
  return (
    <div
      className={className}
      style={{
        ...containerStyle,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Toolbar */}
      <Toolbar
        fileType={type}
        fileName={fileName}
        fileSize={fileSize}
        onDownload={handleDownload}
        onFullscreen={
          type === "image" || type === "pdf"
            ? () => window.open(objectUrl, "_blank")
            : undefined
        }
      />

      {/* Preview area */}
      <div style={{ ...previewAreaStyle, flex: 1, overflow: "auto" }}>
        {type === "image" && <ImageViewer url={objectUrl} alt={fileName} />}

        {type === "video" && (
          <video
            controls
            style={{ width: "100%", maxHeight: 480, display: "block" }}
          >
            <source src={objectUrl} />
            Trình duyệt không hỗ trợ video
          </video>
        )}

        {type === "pdf" && (
          <PdfViewer
            url={objectUrl}
            onError={() => setError("Không thể tải PDF")}
          />
        )}

        {type === "word" &&
          (!canPreviewWord ? (
            <div className="p-4">
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                Chế độ xem Word bằng blob chỉ hỗ trợ định dạng .docx. File .doc
                vui lòng tải về để mở.
              </div>
            </div>
          ) : wordError ? (
            <div className="p-4">
              <ErrorState
                message={wordError}
                onRetry={() => setWordError(null)}
              />
            </div>
          ) : (
            <WordViewer
              blob={blob}
              onError={() => setWordError("Không thể xem trước file Word")}
            />
          ))}

        {type === "excel" &&
          (excelError ? (
            <div style={{ padding: 16 }}>
              <ErrorState
                message={excelError}
                onRetry={() => setExcelError(null)}
              />
            </div>
          ) : (
            <ExcelViewer
              blob={blob}
              onError={() => setExcelError("Không thể xem trước file Excel")}
            />
          ))}

        {type === "powerpoint" &&
          (pptError ? (
            !canPreviewPowerpoint ? (
              officePreviewUrl ? (
                <OfficeOnlinePreview
                  url={officePreviewUrl}
                  title={`PowerPoint preview: ${fileName}`}
                />
              ) : (
                <div style={{ padding: 16 }}>
                  <ErrorState
                    message={
                      "File PowerPoint này chưa thể xem trước trong trình duyệt. Vui lòng tải file về để mở."
                    }
                    onRetry={() => setPptError(null)}
                  />
                </div>
              )
            ) : (
              <PptViewer
                blob={blob}
                onError={() =>
                  setPptError("Không thể xem trước file PowerPoint")
                }
              />
            )
          ) : (
            <PdfViewer
              url={objectUrl}
              onError={() =>
                setPptError("Không thể xem trước PowerPoint theo chế độ PDF")
              }
            />
          ))}

        {type === "unknown" && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: 160,
              fontSize: 13,
              color: "var(--color-text-secondary, #888)",
            }}
          >
            Định dạng file không được hỗ trợ xem trước
          </div>
        )}
      </div>
    </div>
  );
};

export default FilePreview;
