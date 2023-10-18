"use client";
import React, { useRef } from "react";
import styles from "../Header/Header.module.scss";
import Link from "next/link";
import { GiHamburgerMenu } from "react-icons/gi";
import { useNavbarStore } from "@/stores/navbarStore";

const Header = () => {
  const navbarStatus = useNavbarStore((state) => state.navbarStatus);
  const changeStatus = useNavbarStore((state) => state.changeStatus);
  const checkRef = useRef<HTMLInputElement>(null);

  const handleToggle = () => {
    if (navbarStatus === true) {
      changeStatus(false);
    } else {
      changeStatus(true);
    }
  };

  const closeMenu = () => {
    checkRef.current!.checked = false;
    changeStatus(false);
  };

  return (
    <div className={`${styles.header}`}>
      <h1 className={styles.headerSize}>
        <Link href={"/"} className={styles.a}>
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          My Grocery List
        </Link>
      </h1>
      <label className={`${styles.hamburgerMenu}`}>
        <input type="checkbox" onClick={handleToggle} ref={checkRef} />
      </label>
      <div className={styles.sideNav}>
        <ul
          className={`${styles.menuNav}  ${
            navbarStatus === true ? `${styles.showMenu}` : `${styles.hideNav}`
          }`}
        >
          <Link
            href={"/"}
            className="whiteFont"
            style={{
              backgroundColor: "var(--secondary-color)",
              textDecoration: "none",
            }}
          >
            <li
              className={`${styles.headerBtn} ${styles.menuItem}`}
              onClick={closeMenu}
            >
              My List
            </li>
          </Link>
          <Link
            href={"/About"}
            className=" whiteFont"
            style={{
              backgroundColor: "var(--secondary-color)",
              textDecoration: "none",
            }}
          >
            <li
              className={`${styles.headerBtn} ${styles.menuItem}`}
              onClick={closeMenu}
            >
              My Foods
            </li>
          </Link>
          <Link
            className=" whiteFont"
            href={"/FamilyTree"}
            style={{
              backgroundColor: "var(--secondary-color)",
              textDecoration: "none",
            }}
          >
            <li
              className={`${styles.headerBtn} ${styles.menuItem}`}
              onClick={closeMenu}
            >
              My Recipes
            </li>
          </Link>
          <Link
            className=" whiteFont"
            href={"/AddMemory"}
            style={{
              backgroundColor: "var(--secondary-color)",
              textDecoration: "none",
            }}
          >
            <li
              className={`${styles.headerBtn} ${styles.menuItem}`}
              onClick={closeMenu}
            >
              Add a Memory
            </li>
          </Link>
        </ul>
      </div>
    </div>
  );
};

export default Header;
