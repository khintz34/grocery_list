import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import styles from "./Member.module.scss";
import { useState } from "react";

export default function Member(props: any) {
  const [down, setDown] = useState(true);
  const [hidden, setHidden] = useState(`${styles.hide}`);

  function handleToggle() {
    if (down) {
      setDown(false);
      setHidden(`${styles.show}`);
    } else {
      setDown(true);
      setHidden(`${styles.hide}`);
    }
  }
  return (
    <div className={`${styles.container}`} onClick={handleToggle}>
      <div className={styles.memberContainer}>
        <div className={styles.relationship}>{props.relationship}</div>
        <div>{down ? <FaCaretDown /> : <FaCaretUp />}</div>
      </div>
      <div className={`${styles.people} ${hidden}`}>
        {props.people.map((val: any, index: number) => {
          return (
            <p key={`${val.name}-${val.index}`} className={styles.person}>
              {val.rel}: {val.name}
            </p>
          );
        })}
      </div>
    </div>
  );
}
