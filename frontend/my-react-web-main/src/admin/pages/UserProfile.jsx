import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Card,
  Typography,
  Avatar,
  Chip,
  Button,
  Grid,
  Breadcrumbs,
  Link,
  Divider,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import VerifiedIcon from '@mui/icons-material/Verified'
import EmailIcon from '@mui/icons-material/Email'
import PublicIcon from '@mui/icons-material/Public'
import PeopleIcon from '@mui/icons-material/People'
import GroupsIcon from '@mui/icons-material/Groups'
import { users as staticUsers } from '../data/users.js'
import { fetchUsers } from '../api.js'

const statusColor = {
  Active: { bg: '#e6f4ea', color: '#1e7e34' },
  Pending: { bg: '#fff4e0', color: '#b26a00' },
  Rejected: { bg: '#fdeaea', color: '#c62828' },
}

export default function UserProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(() => staticUsers.find((u) => String(u.id) === String(id)) || staticUsers[0])

  useEffect(() => {
    fetchUsers().then((list) => {
      const match = list?.find((u) => String(u.id) === String(id))
      if (match) setUser(match)
    })
  }, [id])

  if (!user) {
    return (
      <Box>
        <Typography variant="h6">User not found</Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/user')} sx={{ mt: 2 }}>
          Back to list
        </Button>
      </Box>
    )
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          User Profile
        </Typography>
        <Breadcrumbs>
          <Link underline="hover" color="inherit" href="/">
            Home
          </Link>
          <Link underline="hover" color="inherit" onClick={() => navigate('/user')} sx={{ cursor: 'pointer' }}>
            List
          </Link>
          <Typography color="text.primary">{user.name}</Typography>
        </Breadcrumbs>
      </Box>

      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/user')}
        sx={{ mb: 2 }}
      >
        Back to list
      </Button>

      <Card sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
          <Avatar src={user.avatar} alt={user.name} sx={{ width: 96, height: 96 }} />
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {user.name}
              </Typography>
              {user.verified && <VerifiedIcon sx={{ color: '#4caf50' }} />}
            </Box>
            <Typography color="text.secondary">{user.email}</Typography>
            <Chip
              label={user.status}
              size="small"
              sx={{
                mt: 1,
                backgroundColor: statusColor[user.status].bg,
                color: statusColor[user.status].color,
                fontWeight: 600,
              }}
            />
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <PublicIcon color="action" />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Country
                </Typography>
                <Typography sx={{ fontWeight: 600 }}>{user.country}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <PeopleIcon color="action" />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Friends
                </Typography>
                <Typography sx={{ fontWeight: 600 }}>{user.friends}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <GroupsIcon color="action" />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Followers
                </Typography>
                <Typography sx={{ fontWeight: 600 }}>{user.followers}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <EmailIcon color="action" />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Email
                </Typography>
                <Typography sx={{ fontWeight: 600 }}>{user.email}</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Card>
    </Box>
  )
}
