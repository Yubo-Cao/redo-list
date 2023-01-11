import AddKanban from "./AddKanban";
import { KanbanItem } from "./KanbanItem";
import { Kanban } from "./kanbansSlice";
import { cls } from "@/lib/utils";

export type KanbansProps = {
    ids: Kanban["id"][];
    className?: string;
    style?: React.CSSProperties;
};

const Kanbans: React.FC<KanbansProps> = ({ ids, className, ...rest }) => {
    return (
        <div className="w-full">
            <div className={cls("kanbans", className)} {...rest}>
                {ids.map((id) => (
                    <KanbanItem
                        id={id}
                        key={id}
                        className="snap-start"
                        style={{ height: "calc(100% - 2rem)" }}
                    />
                ))}
                <AddKanban
                    style={{ height: "calc(100% - 2rem)" }}
                    className="snap-start"
                />
            </div>
            <style jsx>{`
                .kanbans {
                    grid-auto-rows: calc(100%);
                    @apply grid grid-cols-fit-72 gap-6 h-full overflow-x-auto overflow-auto snap-y snap-mandatory items-center;

                    -ms-overflow-style: none;
                    scrollbar-width: none;
                    &::-webkit-scrollbar {
                        display: none;
                    }
                }
            `}</style>
        </div>
    );
};

export default Kanbans;
