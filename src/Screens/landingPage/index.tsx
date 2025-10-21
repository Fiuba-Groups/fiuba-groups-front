import React from "react";
import Header from "../../components/Header";
import styles from './styles.module.scss';

export default function LandingPage() {
    return (
        <div className={styles.container}>
            <Header />
            <div className={styles.landingContent}>
                <h1 className={styles.landingTitle}>TITULO</h1>
            </div>
        </div>
    );
}