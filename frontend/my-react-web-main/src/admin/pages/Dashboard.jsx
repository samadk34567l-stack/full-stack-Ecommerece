import React, { useEffect, useState } from 'react'
import { Grid } from '@mui/material'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import EarningCard from '../components/EarningCard.jsx'
import TotalOrderCard from '../components/TotalOrderCard.jsx'
import IncomeCard from '../components/IncomeCard.jsx'
import VisitorsCard from '../components/VisitorsCard.jsx'
import TotalGrowthBarChart from '../components/TotalGrowthBarChart.jsx'
import PopularStocks from '../components/PopularStocks.jsx'
import AlertsPanel from '../components/AlertsPanel.jsx'
import { fetchDashboardStats } from '../api.js'

export default function Dashboard() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    fetchDashboardStats().then((data) => {
      if (data) setStats(data)
    })
  }, [])

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={4} lg={2.4}>
        <EarningCard amount={stats?.totalEarnings} />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={2.4}>
        <TotalOrderCard count={stats?.totalOrders} />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={2.4}>
        <VisitorsCard count={stats ? stats.totalCustomers : undefined} />
      </Grid>
      <Grid item xs={12} sm={6} md={6} lg={2.4}>
        <IncomeCard
          dark
          icon={<ReceiptLongOutlinedIcon fontSize="small" />}
          value={stats ? `$${Number(stats.totalEarnings || 0).toFixed(2)}` : '$0.00'}
          label="Total Income"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={6} lg={2.4}>
        <IncomeCard
          dark={false}
          value={stats ? String(stats.totalProducts ?? 0) : '0'}
          label="Total Products"
        />
      </Grid>

      <Grid item xs={12} md={8}>
        <TotalGrowthBarChart totalEarnings={stats?.totalEarnings} />
      </Grid>
      <Grid item xs={12} md={4}>
        <PopularStocks />
      </Grid>

      <Grid item xs={12}>
        <AlertsPanel />
      </Grid>
    </Grid>
  )
}
