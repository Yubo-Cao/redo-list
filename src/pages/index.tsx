import Button from "@components/Button";
import Icon from "@components/Icon";
import Layout from "@components/Layout";

export default function Index() {
    return (
        <Layout activeItemId={"my-day"}>
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold text-light-text dark:text-dark-text">
                    <p>My Day</p>
                    <p className="text-uim-400 text-sm font-normal">Today</p>
                </h1>
                <Button className="flex items-center gap-2">
                    <Icon name="add" size={24} />
                    <span>new Task</span>
                </Button>
            </div>
        </Layout>
    );
}
