import { Fragment } from "react";
import styles from "./sign-in-out.module.css";
import { signInWithGoogle, signOut } from "../util/firebase";
import { User } from "firebase/auth";

interface SignInOutProps {
	user: User | null;
}

export default function SignIn({ user }: SignInOutProps) {
	return (
		<Fragment>
			{user !== null ? (
				<button className={styles.authAction} onClick={signOut}>
					Sign Out
				</button>
			) : (
				<button className={styles.authAction} onClick={signInWithGoogle}>
					Sign In
				</button>
			)}
		</Fragment>
	);
}
