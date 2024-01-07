import {classNames, millisToHumanTime} from "@/lib/utils.ts";

const statuses = {
  QUEUED: 'text-orange-400 bg-orange-400/10',
  RUNNING: 'text-cyan-400 bg-cyan-400/10',
  SUCCESS: 'text-green-400 bg-green-400/10',
  FAILURE: 'text-rose-400 bg-rose-400/10'
}

interface Props {
  runs: any[]
}

function getTotalExecutionTime(tasks: any[]): number {
  if (tasks === undefined || tasks.length === 0) {
    return 0
  }

  return tasks.reduce((acc, task) => {
    if (task.post_validate_output && task.post_validate_output.execution_time_in_millis) {
      return acc + task.post_validate_output.execution_time_in_millis
    }

    return acc
  }, 0)
}

function totalSuccessTasks(tasks: any[]): number {
  if (tasks === undefined || tasks.length === 0) {
    return 0
  }

  return tasks.reduce((acc, task) => {
    if (task.status === 'SUCCESS') {
      return acc + 1
    }

    return acc
  }, 0)
}

export default function SelfServiceRunTable({runs}: Props): JSX.Element {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mt-4 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:pl-8"
                >
                  Date
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Tasks
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Execution Time
                </th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 lg:pr-8">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
              {runs.map((run) => (
                <tr key={run.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-500 sm:pl-6 lg:pl-8">
                    {run.created_at}
                  </td>
                  <td className="py-4 pl-0 pr-4 text-sm leading-6 sm:pr-8 lg:pr-20">
                    <div className="flex items-center justify-end gap-x-2 sm:justify-start">
                      <time className="text-gray-400 sm:hidden" dateTime={run.created_at}>
                        {run.created_at}
                      </time>
                      <div className={classNames(statuses[run.status], 'flex-none rounded-full p-1')}>
                        <div className="h-1.5 w-1.5 rounded-full bg-current"/>
                      </div>
                      <div className="hidden text-gray-500 text- sm:block">{run.status}</div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{totalSuccessTasks(run.tasks)}/{run.tasks.length}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{millisToHumanTime(getTotalExecutionTime(run.tasks))}</td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8">
                    <a href="#" className="text-indigo-600 hover:text-indigo-900">
                      Details<span className="sr-only">, {run.name}</span>
                    </a>
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
