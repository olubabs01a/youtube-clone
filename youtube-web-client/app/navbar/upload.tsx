"use client";

import { ChangeEvent, Fragment } from "react";
import styles from "./upload.module.css";
import { uploadVideo } from "../firebase/functions";

export default function Upload() {
	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.item(0);
		if (!!file) {
			handleFileUpload(file);
		}
	};

	const handleFileUpload = async (file: File) => {
		try {
			const response = await uploadVideo(file);
			alert(`Upload successful! Response: ${JSON.stringify(response)}`);
		} catch (error) {
			const errorMessage = `File uplad failed: ${error}`;
			console.error(errorMessage);
			alert(error);
		}
	};

	return (
		<Fragment>
			<input
				id="upload"
				className={styles.uploadInput}
				type="file"
				accept="video/*"
				onChange={handleFileChange}
			/>
			<label htmlFor="upload" className={styles.uploadButton}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 14 14"
					fill="currentColor"
					width={12}
					height={12}
					className="w-4 h-4">
					<path d="M3 4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h5a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H3ZM15 4.75a.75.75 0 0 0-1.28-.53l-2 2a.75.75 0 0 0-.22.53v2.5c0 .199.079.39.22.53l2 2a.75.75 0 0 0 1.28-.53v-6.5Z" />
				</svg>{" "}
				Upload
			</label>
		</Fragment>
	);
}
