import { Eye, Globe, Mail, MapPin, Phone } from "lucide-react";
import Button from "../../../components/UI/Button";
import type { ManagerResponse } from "../../../types/user";
import defaultLogo from "../../../assets/images/simple-logo.png";

type Props = {
  manager: ManagerResponse;
  onSelect?: () => void;
};

const ManagerCard = ({ manager, onSelect }: Props) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition">
      <div className="flex gap-4">
        {/* LOGO */}
        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
          <img
            src={manager.logoUrl || defaultLogo}
            alt={manager.name}
            className="object-cover w-full h-full"
          />
        </div>

        {/* INFO */}
        <div className="flex-1 space-y-1">
          <h3 className="font-semibold text-gray-800 text-lg">
            {manager.name}
          </h3>

          <p className="text-sm text-gray-500">Mã tổ chức: {manager.code}</p>

          <div className="mt-2 space-y-1 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Mail size={14} />
              {manager.email}
            </div>

            <div className="flex items-center gap-2">
              <Phone size={14} />
              {manager.phone}
            </div>

            <div className="flex items-center gap-2">
              <Globe size={14} />
              {manager.website}
            </div>

            <div className="flex items-center gap-2">
              <MapPin size={14} />
              {manager.address}
            </div>
          </div>
        </div>

        {/* ACTION */}
        <div className="flex flex-col gap-2">
          <Button
            size="sm"
            icon={Eye}
            label="Xem chi tiết"
            variant="outline"
            onClick={onSelect}
          />
        </div>
      </div>
    </div>
  );
};

export default ManagerCard;
