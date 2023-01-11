import AddKanban from "./AddKanban";
import { KanbanItem } from "./KanbanItem";
import { Kanban } from "./kanbansSlice";
import { cls } from "@/lib/utils";

export type KanbansProps = {
    ids: Kanban["id"][];
    className: string;
    style: React.CSSProperties;
};

const Kanbans: React.FC<KanbansProps> = ({ ids, className, ...rest }) => {
    return (
        <>
            <div className={cls("kanbans", className)} {...rest}>
                {ids.map((id) => (
                    <KanbanItem id={id} key={id} />
                ))}
                <AddKanban />
            </div>
            <style jsx>{`
                .kanbans {
                    grid-template-rows: repeat(auto-fill, minmax(100%, 1fr));
                    @apply grid grid-cols-fit-72 gap-12 h-full py-4;
                }
            `}</style>
        </>
    );
};

export default Kanbans;
