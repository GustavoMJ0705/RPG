-- Add skills column to players table
ALTER TABLE players 
ADD COLUMN IF NOT EXISTS skills jsonb DEFAULT '[]'::jsonb;

-- Comment for documentation
COMMENT ON COLUMN players.skills IS 'Array of skill objects with id, name, customName, attribute, trained, ranks, miscBonus, isCustom';
