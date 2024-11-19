import Image from "next/image";
import TaskScheduler from "@/components/taskscheduler";

export default function Home() {
  return (
    <div className="w-screen">
      <TaskScheduler />
    </div>
  );
}
