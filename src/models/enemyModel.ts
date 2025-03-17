// get enemy by id
export const getEnemyById = async (enemyId: string, supabase: any) => {
  const { data, error } = await supabase
    .from("Enemy")
    .select()
    .eq("id", enemyId)
    .limit(1)
    .single();

  if (error) {
    console.error("Error fetching enemy: ", error);
    return null;
  }

  return data;
};
