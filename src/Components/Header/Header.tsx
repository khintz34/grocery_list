"use client";
import React, { useContext, useRef } from "react";
import styles from "../Header/Header.module.scss";
import Link from "next/link";
import { useNavbarStore } from "@/stores/navbarStore";
import { HeaderContext } from "@/contexts/authContext";
import { MenuItem } from "../MenuItem/MenuItem";
import { menuItemData } from "../../assets/MenuItemData";

const Header = () => {
  const navbarStatus = useNavbarStore((state) => state.navbarStatus);
  const changeStatus = useNavbarStore((state) => state.changeStatus);
  const checkRef = useRef<HTMLInputElement>(null);
  const { headerText, setHeaderText } = useContext(HeaderContext);

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
          {headerText}
        </Link>
      </h1>
      <label className={`${styles.hamburgerMenu}`} htmlFor="hamburgerMenu">
        <input
          type="checkbox"
          onClick={handleToggle}
          ref={checkRef}
          id="hamburgerMenu"
        />
      </label>
      <div className={styles.sideNav}>
        <ul
          className={`${styles.menuNav}  ${
            navbarStatus === true ? `${styles.showMenu}` : `${styles.hideNav}`
          }`}
        >
          {menuItemData.map((obj, index) => {
            return (
              <MenuItem
                key={`menuItem-${index}`}
                closeMenu={closeMenu}
                name={obj.name}
                linkName={obj.linkName}
              />
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Header;
