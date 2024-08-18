'use client'

import { Box, Button, Stack, TextField, AppBar, Toolbar, Typography, Container, Grid } from '@mui/material'
import { useState, useRef, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRobot } from '@fortawesome/free-solid-svg-icons' // Robot icon from Font Awesome

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm the Headstarter support assistant. How can I help you today?",
    },
  ])
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;
    setIsLoading(true)
    setMessage('')
    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message },
      { role: 'assistant', content: '' },
    ])
  
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([...messages, { role: 'user', content: message }]),
      })
  
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
  
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
  
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const text = decoder.decode(value, { stream: true })
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1]
          let otherMessages = messages.slice(0, messages.length - 1)
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ]
        })
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages((messages) => [
        ...messages,
        { role: 'assistant', content: "I'm sorry, but I encountered an error. Please try again later." },
      ])
    }
    setIsLoading(false)
  }
  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      sendMessage()
    }
  }
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }
  
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: 'transparent', background: 'linear-gradient(45deg, #3b5998, #483d8b)' }}>
        <Toolbar>
          <FontAwesomeIcon icon={faRobot} style={{ marginRight: '10px', color: '#ffeb3b' }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#ffffff' }}>
           FitchatAI
          </Typography>
          <Button sx={{ color: '#ffeb3b', '&:hover': { color: '#ffc107' } }}>Home</Button>
          <Button sx={{ color: '#ffeb3b', '&:hover': { color: '#ffc107' } }}>About</Button>
          <Button sx={{ color: '#ffeb3b', '&:hover': { color: '#ffc107' } }}>Contact</Button>
        </Toolbar>
      </AppBar>
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: 'calc(100vh - 64px)', // Adjust for AppBar height
          backgroundColor: '#2c3e50', // Dark background color
          padding: '20px',
        }}
      >
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Stack
              direction={'column'}
              width="100%" // Full width within the grid column
              height="700px"
              borderRadius={8}
              p={2}
              spacing={3}
              boxShadow="0px 4px 12px rgba(0, 0, 0, 0.5)"
              bgcolor="#3b5998" // Royal Blue for Chat Background
            >
              <Stack
                direction={'column'}
                spacing={2}
                flexGrow={1}
                overflow="auto"
                maxHeight="100%"
                sx={{
                  '&::-webkit-scrollbar': {
                    width: '8px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: '#483d8b', // Violet Scrollbar
                    borderRadius: '8px',
                  },
                }}
              >
                {messages.map((message, index) => (
                  <Box
                    key={index}
                    display="flex"
                    justifyContent={
                      message.role === 'assistant' ? 'flex-start' : 'flex-end'
                    }
                  >
                    <Box
                      bgcolor={
                        message.role === 'assistant'
                          ? '#6a5acd' // Violet for Assistant Messages
                          : '#483d8b' // Dark Violet for User Messages
                      }
                      color="white"
                      borderRadius={16}
                      p={2}
                      maxWidth="80%"
                      boxShadow="0px 2px 6px rgba(0, 0, 0, 0.3)"
                    >
                      {message.content}
                    </Box>
                  </Box>
                ))}
                <div ref={messagesEndRef} />
              </Stack>
              <Stack direction={'row'} spacing={2}>
                <TextField
                  label="Type your message..."
                  fullWidth
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  disabled={isLoading}
                  variant="outlined"
                  sx={{ 
                    input: { color: '#ffffff' }, 
                    label: { color: '#bdbdbd' }, 
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#757575',
                      },
                      '&:hover fieldset': {
                        borderColor: '#9e9e9e',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#ffffff',
                      },
                    },
                  }}
                />
                <Button 
                  variant="contained" 
                  onClick={sendMessage}
                  disabled={isLoading}
                  sx={{
                    bgcolor: '#483d8b', // Violet Button
                    '&:hover': {
                      bgcolor: '#6a5acd', // Darker Violet on Hover
                    },
                    color: '#ffffff',
                  }}
                >
                  {isLoading ? 'Sending...' : 'Send'}
                </Button>
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="flex-start"
              height="700px"
              p={2}
              color="#ffffff"
              bgcolor="#2c3e50"
              boxShadow="0px 4px 12px rgba(0, 0, 0, 0.5)"
              borderRadius={8}
            >
              <Typography variant="h4" gutterBottom>
      Why <b>FitchatAI</b>?
    </Typography>
    <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
      This AI-powered chatbox is designed to support your health and wellness journey. Whether you're seeking advice on mental health, physical fitness, or nutritional guidance, this assistant is here to help.
      <br /><br />
      Our goal is to provide accurate, compassionate, and actionable advice to enhance your overall well-being. Whether you're curious about stress management techniques, looking for fitness tips, or wanting to improve your diet, feel free to ask your questions here.
      <br /><br />
      Remember, while this chatbot provides valuable insights, it's always important to consult with a healthcare professional for personalized medical advice. Let this assistant be your guide on the path to a healthier, happier you.
      <br /><br />
      <i>©powered by ChatGPT-4o</i>
    </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}
