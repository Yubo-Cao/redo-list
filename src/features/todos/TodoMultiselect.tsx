import { RootState, useAppSelector } from "@/store";
import Select, { Props as SelectProps } from "react-select";
import TodoList from "./TodoList";
import { Todo, selectTodoById } from "./todosSlice";

type IdList = Todo["id"][];

type Option = {
    title: string;
    value: Todo["id"];
};

type OptionGroup = {
    title: string;
    options: Option[];
};

type OptionsOrGroups = Option | OptionGroup;

type TodoMultiselectProps = Omit<SelectProps, "onChange"> & {
    ids: IdList;
    value: IdList;
    onChange: (value: IdList) => void;
};

const createOptions = (
    state: RootState,
    ids: Todo["id"][]
): SelectProps["options"] =>
    ids.flatMap((id) => {
        const todo = selectTodoById(state, id),
            { title, subtasks } = todo;
        return subtasks.length
            ? [
                  { label: title, value: id },
                  {
                      label: title,
                      options: subtasks.map((subtaskId) => ({
                          label: selectTodoById(state, subtaskId).title,
                          value: subtaskId
                      }))
                  }
              ]
            : [{ label: title, value: id }];
    });

const flattenOptions = (options: SelectProps["options"]) => {
    let flat: Option[] = [];
    options.forEach((option: OptionsOrGroups) => {
        if (Object.hasOwn(option, "options"))
            flat = flat.concat(...(option as OptionGroup).options);
        else flat = flat.concat([option as Option]);
    });
    return flat;
};

export default function TodoMultiselect(props: TodoMultiselectProps) {
    let { ids, value, onChange, ...rest } = props;
    const options = useAppSelector((state: RootState) =>
            createOptions(state, ids)
        ),
        flattendOptions = flattenOptions(options),
        idToOption = (id: Todo["id"]) => {
            const option = flattendOptions.find(
                (option) => option.value === id
            );

            return option;
        },
        optionToId = (option: Option) => option.value;

    return (
        <>
            <TodoList ids={value} variant="subtask" metas={[]} />
            <Select
                options={options}
                value={value.map(idToOption)}
                onChange={(e: Option) =>
                    onChange([...new Set([...value, optionToId(e)])])
                }
                classNames={{
                    indicatorSeparator: () => "hidden",
                    control: () => "bg-light-surface dark:bg-dark-surface",
                    menuList: () => "bg-light-surface dark:bg-dark-surface"
                }}
                styles={{
                    indicatorsContainer: (base) => ({
                        ...base,
                        display: "none"
                    }),
                    control: (base, state) => ({
                        ...base,
                        ...(state.isFocused
                            ? {
                                  boxShadow: "0 0 0 0px transparent"
                              }
                            : {})
                    })
                }}
                theme={(theme) => ({
                    ...theme,
                    colors: {
                        ...theme.colors,
                        primary: "#fb923c",
                        primary75: "#f3b554",
                        primary50: "#fcd34d",
                        primary25: "#fef3c7"
                    }
                })}
                {...rest}
            />
        </>
    );
}
