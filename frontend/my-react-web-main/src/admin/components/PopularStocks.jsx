import React, { useState, useEffect } from 'react'
import { Card, CardContent, Box, Typography, IconButton, Divider, Chip } from '@mui/material'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { useNavigate } from 'react-router-dom'
import { ResponsiveContainer, AreaChart, Area } from 'recharts'
import { fetchCatalogProducts } from '../api.js'

const chartData = [
  { v: 15 }, { v: 10 }, { v: 25 }, { v: 55 }, { v: 40 }, { v: 60 }, { v: 45 }, { v: 58 }, { v: 50 },
]

export default function PopularStocks() {
  const [products, setProducts] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetchCatalogProducts().then((list) => {
      setProducts((list || []).slice(0, 5))
    })
  }, [])

  const topProduct = products[0]

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 800, fontFamily: `'Georgia', 'Times New Roman', serif`, letterSpacing: 0.3, color: '#00695c' }}
          >
            Popular Products
          </Typography>
          <IconButton size="small">
            <MoreHorizIcon fontSize="small" />
          </IconButton>
        </Box>

        {topProduct && (
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
                  {topProduct.name}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.75)', fontStyle: 'italic' }}>
                  In Stock
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: `'Georgia', serif` }}>
                ${Number(topProduct.price || 0).toFixed(2)}
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
        )}

        {products.map((p, i) => (
          <Box key={p.id || i}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.3 }}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 700, letterSpacing: 0.2 }}>
                  {p.name}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: '#00897b', fontWeight: 600, fontStyle: 'italic' }}
                >
                  #{p.code}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: `'Georgia', serif` }}>
                  ${Number(p.price || 0).toFixed(2)}
                </Typography>
                <Chip
                  size="small"
                  icon={<KeyboardArrowUpIcon sx={{ fontSize: 16 }} />}
                  label=""
                  sx={{
                    bgcolor: '#e0f2f1',
                    color: '#00897b',
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    '& .MuiChip-icon': { m: 0, color: 'inherit' },
                    '& .MuiChip-label': { display: 'none' },
                  }}
                />
              </Box>
            </Box>
            {i < products.length - 1 && <Divider />}
          </Box>
        ))}

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Box
            onClick={() => navigate('/products')}
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
            View All Products
            <ChevronRightIcon sx={{ fontSize: 18 }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}
