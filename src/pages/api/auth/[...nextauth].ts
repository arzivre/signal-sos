import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { readFileSync } from 'fs'
import Handlebars from 'handlebars'
import NextAuth, { User, type NextAuthOptions } from 'next-auth'
import EmailProvider from 'next-auth/providers/email'
import GoogleProvider from 'next-auth/providers/google'
import nodemailer from 'nodemailer'
import path from 'path'
import { prisma } from 'src/server/prisma'

const TRANSPORTER = nodemailer.createTransport(process.env.EMAIL_SERVER)
const EMAIL_DIR = path.resolve(process.cwd(), 'src/emails')

interface Props {
  identifier: string
  url: string
}
const sendVerificationRequest = ({ identifier, url }: Props) => {
  const emailFile = readFileSync(path.join(EMAIL_DIR, 'confirm-email.html'), {
    encoding: 'utf8',
  })
  const emailTemplate = Handlebars.compile(emailFile)
  TRANSPORTER.sendMail({
    from: `"Signal SOS" ${process.env.EMAIL_FROM}`,
    to: identifier,
    subject: 'Your sign-in link for Signal SOS',
    html: emailTemplate({
      base_url: process.env.NEXTAUTH_URL,
      signin_url: url,
      email: identifier,
    }),
  })
}

const sendWelcomeEmail = async ({ user }: { user: User }) => {
  const { email } = user

  try {
    const emailFile = readFileSync(path.join(EMAIL_DIR, 'welcome.html'), {
      encoding: 'utf8',
    })
    const emailTemplate = Handlebars.compile(emailFile)
    await TRANSPORTER.sendMail({
      from: `"Signal SOS" ${process.env.EMAIL_FROM}`,
      to: email!,
      subject: 'Welcome to Signal SOS!',
      html: emailTemplate({
        base_url: process.env.NEXTAUTH_URL,
        support_email: 'support@signal-sos.vercel.app',
      }),
    })
  } catch (error) {
    console.log(`❌ Unable to send welcome email to user (${email})`)
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    EmailProvider({
      maxAge: 60 * 60 * 24,
      sendVerificationRequest,
    }),
  ],
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  events: { createUser: sendWelcomeEmail },
}

export default NextAuth(authOptions)
