import { Badge } from "@/components/Badge";
import { RunStatus } from "@/enums/run-status.enum";
import { ThemeColors } from "@/enums/theme-colors.enum";
import {
  ChevronRightIcon,
  ClockIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useAtom, useAtomValue } from "jotai";
import { Link } from "react-router-dom";
import { runsSidebarExpandedAtom } from "../atoms";
import { runsAtom } from "./atoms";

dayjs.extend(relativeTime);

const getStatusColor = (status: RunStatus, asClass?: boolean) => {
  switch (status) {
    case RunStatus.QUEUED:
      return asClass ? "bg-orange-500" : ThemeColors.WARNING;
    case RunStatus.RUNNING:
      return asClass ? "bg-cyan-400" : ThemeColors.PRIMARY;
    case RunStatus.FAILURE:
      return asClass ? "bg-rose-400" : ThemeColors.DANGER;
    case RunStatus.SUCCESS:
      return asClass ? "bg-green-400" : ThemeColors.SUCCESS;
    default:
      return asClass ? "bg-gray-400" : ThemeColors.PRIMARY;
  }
};

export default function ServicesRunsSidebar() {
  const [{ data }] = useAtom(runsAtom);
  const [runsSidebarExpanded, setRunsSidebarExpanded] = useAtom(
    runsSidebarExpandedAtom,
  );

  return (
    <div
      className={clsx(
        "relative box-content flex min-h-[calc(100vh-65px)] w-[60px] min-w-[60px] cursor-pointer flex-col overflow-hidden border-l border-gray-200 bg-white duration-500",
        runsSidebarExpanded && "!min-w-[300px]",
      )}
      onClick={() => setRunsSidebarExpanded(!runsSidebarExpanded)}
    >
      <div className="relative flex h-12 w-full items-center border-b border-gray-200 p-4">
        {!runsSidebarExpanded && <ClockIcon className="size-5 text-gray-400" />}
        <div
          className={clsx(
            "flex max-w-0 items-center opacity-0 transition-all duration-300",
            runsSidebarExpanded && "max-w-[200px] opacity-100",
          )}
        >
          <ChevronRightIcon className="mr-2 size-5 text-gray-400" />
          <p className="whitespace-nowrap text-sm">My in progress runs</p>
        </div>
      </div>
      <div className="pretty-scrollbar flex size-full flex-col overflow-y-auto overflow-x-hidden">
        {data?.map((run) => (
          <RunItem
            key={run.id}
            actionSlug={run.action_slug}
            inputName={run.input_payload.name}
            updatedAt={run.updated_at}
            status={run.status}
          />
        ))}
      </div>
    </div>
  );
}

interface RunItemProps {
  actionSlug: string;
  inputName: string;
  updatedAt: string;
  status: RunStatus;
}

const RunItem = ({
  actionSlug,
  inputName,
  updatedAt,
  status,
}: RunItemProps) => {
  const runsSidebarExpanded = useAtomValue(runsSidebarExpandedAtom);

  return (
    <div
      className={clsx(
        "relative min-h-[68px] w-full shrink-0 border-b border-gray-200 px-4 py-5 duration-300",
        !runsSidebarExpanded && "hover:bg-gray-100",
      )}
    >
      <div className="flex max-h-[200px] flex-col gap-[10px] ">
        <div className="flex items-start">
          <div className="relative">
            <InformationCircleIcon className="size-5 text-gray-400" />
            <span
              className={clsx(
                "absolute bottom-0 left-3 block size-2 rounded-full",
                getStatusColor(status, true),
                runsSidebarExpanded && "hidden",
              )}
            ></span>
          </div>
          {runsSidebarExpanded && (
            <div className="flex flex-col items-start space-y-4">
              <Link to="" className="ml-2.5 flex flex-col">
                <p className="!select-none text-sm font-medium hover:underline">
                  {actionSlug}
                </p>
              </Link>
              <p className="text-xs text-gray-400">{inputName}</p>
              <Badge
                status={getStatusColor(status) as ThemeColors}
                text={status}
              />
              <p className="text-xs text-gray-400">
                {dayjs(updatedAt).fromNow()}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
