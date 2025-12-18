import React, { ReactNode, useState } from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import styles from "./styles.module.scss";

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => setCollapsed((s) => !s);

  return (
    <div className={styles.shell} data-collapsed={collapsed}>
      <Header />
      <Sidebar collapsed={collapsed} onToggle={toggleCollapsed} />
      <main className={styles.content}>
        {children}
      </main>
    </div>
  );
}