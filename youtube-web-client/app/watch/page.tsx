"use client";

import styles from "./page.module.css";

import { useSearchParams } from "next/navigation";
import { loadConfiguration } from "@configuration";

export default function Watch() {
	const videoSrc = useSearchParams().get("v");
  const getStoragePrefix = `https://storage.googleapis.com/${loadConfiguration().processedVideoBucketName}`;

	return (
		<div className={styles.main}>
			{videoSrc && (
				<>
					<h4 className={styles.header}>Now playing: {videoSrc}</h4>
					<video src={`${getStoragePrefix}/${videoSrc}`} controls muted autoPlay />
				</>
			)}
		</div>
	);
}
