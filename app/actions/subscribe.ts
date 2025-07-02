// 'use server'

// import fs from 'fs'
// import path from 'path'

// export async function subscribeToUpdates(email: string, interests: string[] = []) {
//   try {
//     console.log('Starting subscription process with:', { email, interests })

//     // Path to the CSV file
//     const csvPath = path.join(process.cwd(), 'subscribers.csv')
//     let emailExists = false

//     // Check if the file exists and if the email is already present
//     if (fs.existsSync(csvPath)) {
//       const fileContent = fs.readFileSync(csvPath, { encoding: 'utf8' })
//       const lines = fileContent.split('\n')
//       emailExists = lines.some(line => {
//         const [csvEmail] = line.split(',')
//         return csvEmail.replace(/\"/g, '').trim().toLowerCase() === email.trim().toLowerCase()
//       })
//     }

//     if (emailExists) {
//       console.log('Email already exists:', email)
//       return {
//         success: false,
//         error: 'This email is already subscribed.'
//       }
//     }

//     // Append to CSV file
//     try {
//       const now = new Date().toISOString()
//       const csvLine = `"${email}","${interests.join(';')}","${now}"\n`
//       fs.appendFileSync(csvPath, csvLine, { encoding: 'utf8', flag: 'a' })
//     } catch (csvError) {
//       console.error('Failed to write to CSV:', csvError)
//       return {
//         success: false,
//         error: 'Failed to save subscription.'
//       }
//     }

//     console.log('Subscriber saved to CSV successfully')
//     return {
//       success: true,
//       message: 'Successfully subscribed to updates!'
//     }
//   } catch (error) {
//     console.error('Subscription error:', error)
//     return {
//       success: false,
//       error: 'Failed to subscribe. Please try again.'
//     }
//   }
// }

'use server'

import { prisma } from '@/lib/prisma'

export async function subscribeToUpdates(email: string, interests: string[] = []) {
  try {
    // Check if email already exists
    const existingSubscriber = await prisma.subscriber.findUnique({
      where: { email }
    })

    if (existingSubscriber) {
      return {
        success: false,
        error: 'This email is already subscribed.'
      }
    }

    // Create subscriber
    await prisma.subscriber.create({
      data: {
        email,
        interests
      }
    })

    return {
      success: true,
      message: 'Successfully subscribed to updates!'
    }
  } catch (error) {
    return {
      success: false,
      error: 'Failed to subscribe. Please try again.'
    }
  }
}