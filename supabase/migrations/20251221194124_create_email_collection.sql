/*
  # Email Collection for Resume Downloads
  
  1. New Tables
    - `email_downloads`
      - `id` (uuid, primary key)
      - `email` (text, not null)
      - `downloaded_at` (timestamptz, defaults to now())
      - `ip_address` (text, optional for tracking)
  
  2. Security
    - Enable RLS on `email_downloads` table
    - Add policy for public insert (anyone can submit email to download)
    
  3. Notes
    - This table tracks email addresses provided when users download their tailored resumes
    - No authentication required - public access for inserts only
    - Read access restricted for privacy
*/

CREATE TABLE IF NOT EXISTS email_downloads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  downloaded_at timestamptz DEFAULT now(),
  ip_address text
);

ALTER TABLE email_downloads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit email for download"
  ON email_downloads
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_email_downloads_email ON email_downloads(email);
CREATE INDEX IF NOT EXISTS idx_email_downloads_downloaded_at ON email_downloads(downloaded_at);