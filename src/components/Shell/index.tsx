import React, { ReactNode } from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import styles from "./styles.module.scss";

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className={styles.shell}>
      <Header />
      <Sidebar />
      <main className={styles.content}>
        {children}
      </main>
    </div>
  );
}