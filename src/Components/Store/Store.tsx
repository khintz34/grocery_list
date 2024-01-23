import { FoodListObj } from "@/assets/FoodList";
import styles from "./Store.module.css";
import { BsPlusCircle } from "react-icons/bs";
import { useEffect, useState } from "react";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortablePath } from "../SortablePath/SortablePath";
import { ref, set } from "firebase/database";
import { db } from "@/assets/firebase";

interface Props {
  store: {
    store: string;
    path: Array<string>;
  };
  index: number;
}

export default function Store(props: Props) {
  const [down, setDown] = useState(true);
  const [hidden, setHidden] = useState(`${styles.hide}`);
  const [listArray, setListArray] = useState<Array<any>>(props.store.path);

  useEffect(() => {
    setListArray(props.store.path);
  }, [props.store.path]);

  function handleToggle() {
    if (down) {
      setDown(false);
      setHidden(`${styles.show}`);
    } else {
      setDown(true);
      setHidden(`${styles.hide}`);
    }
  }

  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setListArray((items) => {
        const activeIndex = items.indexOf(active.id);
        const overIndex = items.indexOf(over.id);
        updateStoreOrder(arrayMove(items, activeIndex, overIndex));
        return arrayMove(items, activeIndex, overIndex);
      });
    }
  }

  function updateStoreOrder(list: Array<string>) {
    set(ref(db, "ShoppingOrderList/" + props.store.store + "/"), list).catch(
      (error) => {
        console.log(error);
      }
    );
  }

  return (
    <main
      className={`${styles.storeContainer}`}
      key={`${props.store.store}-${props.index}`}
    >
      <div className={styles.nameContainer}>
        <p className={styles.name}>{props.store.store}</p>
        <div className={styles.btnContainer}>
          <div onClick={handleToggle}>
            {down ? <FaCaretDown /> : <FaCaretUp />}
          </div>
        </div>
      </div>
      <div className={`${styles.pathItem} ${hidden}`}>
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            strategy={verticalListSortingStrategy}
            items={props.store.path}
          >
            {listArray.map((section: string, i: number) => {
              return (
                <SortablePath
                  id={section}
                  section={section}
                  key={`section-${section}-${props.store.store}`}
                />
              );
            })}
          </SortableContext>
        </DndContext>
      </div>
    </main>
  );
}
