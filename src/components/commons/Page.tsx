import { PropsWithChildren } from 'react'

export interface PageProps {
  title: string
}
const Page = (props: PropsWithChildren<PageProps>) => {
  return (
    <div>
      <h4>{props.title}</h4>
      {props.children}
    </div>
  )
}

export default Page
