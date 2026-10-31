import React from 'react'
import {
  Card,
  CardContent,
  Box,
  Typography,
  Select,
  MenuItem,
  IconButton,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'

// Data replicated to match the screenshot bar heights/shapes exactly
const data = [
  { name: 'Jan', investment: 45, loss: 20, profit: 35, maintenance: 0 },
  { name: 'Feb', investment: 125, loss: 10, profit: 160, maintenance: 0 },
  { name: 'Mar', investment: 15, loss: 10, profit: 20, maintenance: 90 },
  { name: 'Apr', investment: 55, loss: 15, profit: 30, maintenance: 0 },
  { name: 'May', investment: 90, loss: 25, profit: 5, maintenance: 0 },
  { name: 'Jun', investment: 80, loss: 10, profit: 140, maintenance: 70 },
  { name: 'Jul', investment: 110, loss: 5, profit: 100, maintenance: 0 },
  { name: 'Aug', investment: 25, loss: 15, profit: 25, maintenance: 0 },
  { name: 'Sep', investment: 25, loss: 20, profit: 25, maintenance: 0 },
  { name: 'Oct', investment: 65, loss: 65, profit: 40, maintenance: 0 },
  { name: 'Nov', investment: 20, loss: 15, profit: 15, maintenance: 130 },
  { name: 'Dec', investment: 80, loss: 40, profit: 25, maintenance: 0 },
]

// Colors matched to the legend in screenshot
const COLORS = {
  investment: '#c5e1a5',
  loss: '#9ccc65',
  profit: '#7cb342',
  maintenance: '#558b2f',
}

const renderLegend = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 1 }}>
    {[
      { key: 'investment', label: 'Investment' },
      { key: 'loss', label: 'Loss' },
      { key: 'profit', label: 'Profit' },
      { key: 'maintenance', label: 'Maintenance' },
    ].map((item) => (
      <Box key={item.key} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
        <Box
          sx={{
            width: 10,
            height: 10,
            borderRadius: '2px',
            backgroundColor: COLORS[item.key],
          }}
        />
        <Typography variant="caption" color="text.secondary">
          {item.label}
        </Typography>
      </Box>
    ))}
  </Box>
)

export default function TotalGrowthBarChart() {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Total Growth
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              $2,324.00
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Select size="small" defaultValue="today" sx={{ minWidth: 110 }}>
              <MenuItem value="today">Today</MenuItem>
              <MenuItem value="week">This Week</MenuItem>
              <MenuItem value="month">This Month</MenuItem>
            </Select>
            <IconButton size="small">
              <MenuIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
        <ResponsiveContainer width="100%" height={340}>
          <BarChart data={data} barGap={2} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="#f0f0f0" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#697586' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#697586' }}
              domain={[0, 400]}
              ticks={[0, 100, 200, 300, 400]}
            />
            <Tooltip cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
            <Bar dataKey="investment" stackId="s" fill={COLORS.investment} />
            <Bar dataKey="loss" stackId="s" fill={COLORS.loss} />
            <Bar dataKey="profit" stackId="s" fill={COLORS.profit} />
            <Bar dataKey="maintenance" stackId="s" fill={COLORS.maintenance} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        {renderLegend()}
      </CardContent>
    </Card>
  )
}
