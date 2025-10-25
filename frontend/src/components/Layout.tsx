import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  CalendarMonth as CalendarIcon,
  BarChart as BarChartIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  Today as TodayIcon,
  ChevronLeft,
  ChevronRight,
} from '@mui/icons-material';
import { useAuth } from './AuthContext';
import { useCalendar } from '../context/CalendarContext';
import { Outlet } from 'react-router-dom';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

const drawerWidth = 240;

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/login');
  };

  const handleProfileClick = () => {
    handleMenuClose();
    navigate('/profile');
  };

  const menuItems = [
    { text: 'Anasayfa', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Takvim', icon: <CalendarIcon />, path: '/calendar' },
    { text: 'İstatistikler', icon: <BarChartIcon />, path: '/stats' },
  ];

  const { handlePreviousMonth, handleNextMonth, handleToday, currentDate } = useCalendar();

  // Sidebar drawer
  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>

      {/* Sidebar header */}
      <Toolbar sx={{
        background: 'linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)',
        color: 'white'
      }}>

        {/* Title */}
        <Typography variant="h6" noWrap component="div" fontWeight="bold">
          TaskTrack
        </Typography>
        {/* Title */}

      </Toolbar>
      {/* Sidebar header */}

      <Divider />

      {/* Sidebar Links */}
      <List sx={{ flexGrow: 1, pt: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 1, px: 2 }}>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 1,
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  },
                },
                '&:hover': {
                  bgcolor: 'action.hover',
                  borderRadius: 2,
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <ListItemIcon sx={{
                color: location.pathname === item.path ? 'white' : 'primary.main',
                minWidth: 40
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  '& .MuiTypography-root': {
                    fontWeight: location.pathname === item.path ? 'bold' : 'medium'
                  }
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      {/* Sidebar Links */}

      {/* Sidebar footer */}
      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Typography variant="caption" color="text.secondary" align="center" display="block">
          TaskTrack v1.0
        </Typography>
      </Box>
      {/* Sidebar footer */}

    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* Navbar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          {/* Hamburger */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          {/* Hamburger */}

          {/* Page header */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {menuItems.find(item => item.path === location.pathname)?.text || 'Anasayfa'}
          </Typography>
          {/* Page header */}

          {location.pathname === "/calendar" ?
            <Box display="flex" alignItems="center" sx={{ flexGrow: 1 }}>
              <Tooltip title="Bugün">
                <IconButton
                  onClick={handleToday}
                  color="inherit">
                  <TodayIcon />
                </IconButton>
              </Tooltip>

              <IconButton
                onClick={handlePreviousMonth}
                color="inherit"
              >
                <ChevronLeft />
              </IconButton>

              <Typography variant="h6" sx={{ minWidth: 200, textAlign: 'center' }}>
                {format(currentDate, 'MMMM yyyy', { locale: tr })}
              </Typography>

              <IconButton
                onClick={handleNextMonth}
                color="inherit"
              >
                <ChevronRight />
              </IconButton>
            </Box>
            :
            <></>}

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {user && (
              <>
                <Typography variant="body1" sx={{ mr: 2 }}>
                  {user.username}
                </Typography>
                <IconButton
                  size="large"
                  edge="end"
                  color="inherit"
                  onClick={handleMenuOpen}
                >
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                    {user.username.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  <MenuItem onClick={handleProfileClick}>
                    <ListItemIcon>
                      <AccountCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Profil</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Çıkış Yap</ListItemText>
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          maxWidth: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          bgcolor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        <Toolbar />
        <Box sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          maxWidth: '100%',
          overflow: 'auto'
        }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout; 