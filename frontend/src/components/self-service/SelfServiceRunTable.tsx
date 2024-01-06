import {millisToHumanTime} from "@/lib/utils.ts";

interface Props {
  runs: any[]
}

function getTotalExecutionTime(tasks: any[]): number {
  return tasks.reduce((acc, task) => {
    if (task.post_validate_output && task.post_validate_output.execution_time_in_millis) {
      return acc + task.post_validate_output.execution_time_in_millis
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
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{run.status}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{run.tasks.length}/{run.tasks.length}</td>
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
