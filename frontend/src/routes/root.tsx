import {Form, Outlet, useNavigation,} from 'react-router-dom'
import {Button} from "@/components/ui/button.tsx";


export default function Root() {
  const navigation = useNavigation()


  return (
    <>
      <div id="sidebar">
        <h1>Torii</h1>
        <div>
          <Form method="post">
            <Button type="submit">New</Button>
          </Form>
        </div>
        <nav>
          <div>toto</div>
        </nav>
      </div>
      <div
        id="detail"
        className={navigation.state === 'loading' ? 'loading' : ''}
      >
        <Outlet/>
      </div>
    </>
  )
}
