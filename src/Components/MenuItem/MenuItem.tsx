import Link from "next/link";
import styles from "./MenuItem.module.scss";

type Props = {
  closeMenu: Function;
  name: String;
  linkName: String;
};

export function MenuItem({ closeMenu, name, linkName }: Props) {
  return (
    <Link href={`/${linkName}`} className={styles.link} as={`/${linkName}`}>
      <li
        className={styles.menuItem}
        onClick={() => {
          closeMenu();
        }}
      >
        {name}
      </li>
    </Link>
  );
}
