"use client";

import { Fragment } from "react";
import styles from "./upload.module.css";
import { uploadVideo } from "../firebase/functions";

export default function Upload() {
	return (
		<Fragment>
			<button className={styles.upload}>
				Upload
			</button>
		</Fragment>
	);
}
