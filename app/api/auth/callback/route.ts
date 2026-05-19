import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'                
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams, origin } = new URL(req.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.exchangeCodeForSession(code)

    if (session?.user) {
      await prisma.profile.upsert({
        where: { id: session.user.id },
        update: {},
        create: {
          id: session.user.id,
          fullName: session.user.user_metadata?.full_name ?? null,
          avatarUrl: session.user.user_metadata?.avatar_url ?? null,
        },
      })
    }
  }

  return NextResponse.redirect(origin + '/dashboard')
}