import React, { useState } from 'react'
import { Card, Box, Typography, Avatar, ButtonGroup, Button } from '@mui/material'
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import { ResponsiveContainer, LineChart, Line } from 'recharts'

const data = [
  { v: 20 }, { v: 35 }, { v: 25 }, { v: 45 }, { v: 30 }, { v: 55 }, { v: 40 }, { v: 60 }, { v: 50 },
]

export default function TotalOrderCard({ count }) {
  const [range, setRange] = useState('Year')
  const displayCount = Number(count || 0).toLocaleString()
  return (
    <Card
      sx={{
        height: '100%',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(210.04deg, #5e35b1 -50.94%, #9575cd 95.49%)',
      }}
    >
      <Box sx={{ position: 'absolute', width: 160, height: 160, borderRadius: '50%', top: -60, right: -40, bgcolor: 'rgba(255,255,255,0.08)' }} />
      <Box sx={{ p: 2.5, position: 'relative' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', width: 44, height: 44 }}>
            <ShoppingBagOutlinedIcon />
          </Avatar>
          <ButtonGroup size="small" sx={{ bgcolor: 'rgba(255,255,255,0.15)', borderRadius: 2 }}>
            {['Month', 'Year'].map((r) => (
              <Button
                key={r}
                onClick={() => setRange(r)}
                sx={{
                  color: '#fff',
                  border: 'none !important',
                  bgcolor: range === r ? 'rgba(255,255,255,0.25)' : 'transparent',
                  fontSize: 12,
                  px: 1.5,
                }}
              >
                {r}
              </Button>
            ))}
          </ButtonGroup>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 3 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>{displayCount}</Typography>
            <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.5 }}>New Orders</Typography>
          </Box>
          <Box sx={{ width: 100, height: 44 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <Line type="monotone" dataKey="v" stroke="#fff" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Box>
      </Box>
    </Card>
  )
}
