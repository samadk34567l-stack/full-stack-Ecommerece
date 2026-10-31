import React from 'react'
import { Card, CardContent, Box, Typography, IconButton, Divider, Chip } from '@mui/material'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { ResponsiveContainer, AreaChart, Area } from 'recharts'

const chartData = [
  { v: 15 }, { v: 10 }, { v: 25 }, { v: 55 }, { v: 40 }, { v: 60 }, { v: 45 }, { v: 58 }, { v: 50 },
]

const stocks = [
  { name: 'Nova Tech', price: '$2145.00', change: '12% Profit', up: true },
  { name: 'Orbit Labs', price: '$150.00', change: '8% Loss', up: false },
  { name: 'Pinnacle Corp', price: '$320.00', change: '15% Profit', up: true },
  { name: 'Silverline', price: '$210.00', change: '6% Loss', up: false },
  { name: 'Vertex Group', price: '$275.00', change: '9% Profit', up: true },
]

export default function PopularStocks() {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 800, fontFamily: `'Georgia', 'Times New Roman', serif`, letterSpacing: 0.3, color: '#00695c' }}
          >
            Market Movers
          </Typography>
          <IconButton size="small">
            <MoreHorizIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box
          sx={{
            background: 'linear-gradient(135deg, #00695c 0%, #26a69a 100%)',
            color: '#fff',
            borderRadius: 3,
            p: 2,
            mb: 1,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: 0.6, fontSize: '0.78rem' }}
              >
                Nova Tech
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.75)', fontStyle: 'italic' }}>
                12% Profit
              </Typography>
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: `'Georgia', serif` }}>
              $2145.00
            </Typography>
          </Box>
          <Box sx={{ height: 80, mt: 1, mx: -2, mb: -2 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="stockGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffffff" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#ffffff" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="v" stroke="#ffffff" strokeWidth={2} fill="url(#stockGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </Box>

        {stocks.map((s, i) => (
          <Box key={s.name + i}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.3 }}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 700, letterSpacing: 0.2 }}>
                  {s.name}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: s.up ? '#00897b' : '#e53935', fontWeight: 600, fontStyle: 'italic' }}
                >
                  {s.change}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: `'Georgia', serif` }}>
                  {s.price}
                </Typography>
                <Chip
                  size="small"
                  icon={
                    s.up ? (
                      <KeyboardArrowUpIcon sx={{ fontSize: 16 }} />
                    ) : (
                      <KeyboardArrowDownIcon sx={{ fontSize: 16 }} />
                    )
                  }
                  label=""
                  sx={{
                    bgcolor: s.up ? '#e0f2f1' : '#ffebee',
                    color: s.up ? '#00897b' : '#e53935',
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    '& .MuiChip-icon': { m: 0, color: 'inherit' },
                    '& .MuiChip-label': { display: 'none' },
                  }}
                />
              </Box>
            </Box>
            {i < stocks.length - 1 && <Divider />}
          </Box>
        ))}

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: '#00897b',
              fontSize: 13,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              cursor: 'pointer',
            }}
          >
            View All
            <ChevronRightIcon sx={{ fontSize: 18 }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}
