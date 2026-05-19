import { createClient } from '@/lib/supabase/client' 

export async function uploadImage(
  file: File,
  bucket: 'avatars' | 'banners',
  userId: string
): Promise<string> {
  const supabase = createClient()
  const ext = file.name.split('.').pop()
  const path = `${userId}/${Date.now()}.${ext}`

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: true })

  if (error) throw error

  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl
}