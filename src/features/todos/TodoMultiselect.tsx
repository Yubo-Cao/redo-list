import { RootState } from "@/store";
import { useSelector } from "react-redux";
import Select, { Props as SelectProps } from "react-select";
import { Todo, selectTodoById } from "./todosSlice";
import { useState } from "react";
import TodoList from "./TodoList";

type IdList = Todo["id"][];

type TodoMultiselectProps = Omit<SelectProps, "onChange"> & {
    ids: IdList;
    value: IdList;
    onChange: (value: IdList) => void;
};

const createOptions = (ids: Todo["id"][]) => (state: RootState) =>
    ids.map((id) => {
        const { title, subtasks } = selectTodoById(state, id);
        return subtasks.length
            ? {
                  label: title,
                  options: subtasks.map((subtaskId) => ({
                      label: selectTodoById(state, subtaskId).title,
                      value: subtaskId
                  }))
              }
            : { label: title, value: id };
    });

export default function TodoMultiselect(props: TodoMultiselectProps) {
    let { ids, value, onChange, ...rest } = props;
    const options = useSelector<RootState>(createOptions(ids));
    const [selected, setSelected] = useState(ids);
    onChange = onChange != null ? onChange : setSelected;

    return (
        <>
            <TodoList ids={selected} />
            <Select
                options={options}
                onChange={(e) => {
                    console.log(e);
                }}
                {...rest}
            />
        </>
    );
}
