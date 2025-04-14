/*
  # Create Health Check Sessions Schema

  1. New Tables
    - `alula_health_check_sessions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `session_id` (uuid) - Alula session ID
      - `status` (text) - pending, completed, error
      - `scan_data` (jsonb) - User health data
      - `scan_result` (jsonb) - Scan results
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      
  2. Security
    - Enable RLS on alula_health_check_sessions table
    - Add policies for authenticated users to:
      - Read their own sessions
      - Create new sessions
      - Update their own sessions
*/

CREATE TABLE IF NOT EXISTS alula_health_check_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  session_id uuid,
  status text NOT NULL DEFAULT 'pending',
  scan_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  scan_result jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE alula_health_check_sessions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can read own sessions"
  ON alula_health_check_sessions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create sessions"
  ON alula_health_check_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions"
  ON alula_health_check_sessions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);