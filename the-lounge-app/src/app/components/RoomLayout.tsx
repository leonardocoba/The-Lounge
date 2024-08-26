import { ReactNode } from "react";

interface RoomLayoutProps {
  children: ReactNode;
}

const RoomLayout = ({ children }: RoomLayoutProps) => {
  return (
    <div className="room-layout">
      <header className="room-header">
        <h2>Room Header</h2>
      </header>
      <main className="room-content">{children}</main>
      <footer className="room-footer">
        <p>Room Footer</p>
      </footer>
    </div>
  );
};

export default RoomLayout;
