import { query } from "./_generated/server";

export const overview = query({
  args: {},
  handler: async (ctx) => {
    const [doctors, hospitals] = await Promise.all([
      ctx.db.query("doctors").collect(),
      ctx.db.query("hospitals").collect(),
    ]);

    const [recentDoctors, recentHospitals] = await Promise.all([
      ctx.db.query("doctors").order("desc").take(5),
      ctx.db.query("hospitals").order("desc").take(5),
    ]);

    return {
      totals: {
        doctors: doctors.length,
        hospitals: hospitals.length,
      },
      recentDoctors,
      recentHospitals,
    };
  },
});
