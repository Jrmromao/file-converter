'use server'

import { prisma } from '@/app/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function subscribeToUpdates(email: string, interests: string[] = []) {
  try {
    console.log('Starting subscription process with:', { email, interests })

    // Check if email already exists
    const existingSubscriber = await prisma.subscriber.findUnique({
      where: { email }
    })

    if (existingSubscriber) {
      console.log('Email already exists:', email)
      return {
        success: false,
        error: 'This email is already subscribed.'
      }
    }

    // Create subscriber and feature requests in a transaction
    await prisma.$transaction(async (tx) => {
      // Create subscriber
      const subscriber = await tx.subscriber.create({
        data: {
          email,
          interests,
          status: 'active'
        }
      })

      // Create one feature request at a time, linking to the new subscriber
      for (const interest of interests) {
        await tx.featureRequest.create({
          data: {
            title: `Feature Request for ${interest}`,
            description: `User interested in ${interest} features`,
            status: 'pending',
            votes: 0,
            subscriberId: subscriber.id
          }
        })
      }
    })

    console.log('Subscriber and feature requests created successfully')
    revalidatePath('/')
    return {
      success: true,
      message: 'Successfully subscribed to updates!'
    }
  } catch (error) {
    console.error('Subscription error:', error)
    return {
      success: false,
      error: 'Failed to subscribe. Please try again.'
    }
  }
}