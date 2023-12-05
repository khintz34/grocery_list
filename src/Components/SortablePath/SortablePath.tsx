import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MdDragIndicator } from "react-icons/md";
import styles from "./SortablePath.module.scss";
import { IconContext } from "react-icons";

interface Props {
  section: string;
  id: any;
}

export function SortablePath(props: Props) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={styles.main}
    >
      <IconContext.Provider value={{ className: "scale" }}>
        <MdDragIndicator className={styles.scale} />
      </IconContext.Provider>
      <div className={styles.section}>{props.section}</div>
    </div>
  );
}
