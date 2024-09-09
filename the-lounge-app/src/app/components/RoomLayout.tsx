import { ReactNode } from "react";
interface RoomLayoutProps {
  children: ReactNode;
}

const RoomLayout = ({ children }: RoomLayoutProps) => {
  return (
    <div className="room-layout">
      <main className="room-content">{children}</main>
    </div>
  );
};

export default RoomLayout;
