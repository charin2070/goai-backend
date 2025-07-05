import { Stat } from '@/app/stat'
import { Avatar } from '@/components/avatar'
import { Heading, Subheading } from '@/components/heading'
import { Select } from '@/components/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table'
import { getRecentOrders, type Order } from 'data'

export default async function Home() {
  let orders = await getRecentOrders()

  return (
    <>
      <Heading>Backend</Heading>
      <div className="mt-8 flex items-end justify-between">
        <Subheading>Services</Subheading>
        <div>
          <Select name="period">
            <option value="last_week">Now</option>
            <option value="last_two">This week</option>
            <option value="last_month">This month</option>
            <option value="last_quarter">All time</option>
          </Select>
        </div>
      </div>
      <div className="mt-4 grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
        {/* Services cards */}
      </div>
    </>
  )
}
