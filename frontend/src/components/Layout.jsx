import { Outlet } from "react-router-dom";

export default function Layout({ children }) {
  return (
    <div className="app-container">
      {/* 
        The Layout component serves as the top-level container.
        It expects specific children (Sidebar, NoteList, Editor) 
        but handles the overall flex container.
        
        If 'children' are not passed, it renders an Outlet for nested routes 
        (though in this single-page dashboard app, we might just pass components directly).
      */}
      {children || <Outlet />}
    </div>
  );
}
