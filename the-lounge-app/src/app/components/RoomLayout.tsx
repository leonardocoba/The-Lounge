import { ReactNode } from "react";
import Navbar from "./NavBar";
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
