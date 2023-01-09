import { MultiSelect, SelectProps } from "react-multi-select-component";
import { Todo, selectTodoById } from "./todosSlice";
import { useSelector } from "react-redux";

type TodoMultiselectProps = Omit<SelectProps, "options" | "labelledBy"> & {
    ids: Todo["id"][];
};

export default function TodoMultiselect({
    ids,
    ...rest
}: TodoMultiselectProps) {
    console.log(ids);

    const options = useSelector((state) =>
        ids.map((id) => {
            const { title } = selectTodoById(state, id);
            return { label: title, value: id };
        })
    );
    return <MultiSelect options={options} labelledBy="Select" {...rest} />;
}
