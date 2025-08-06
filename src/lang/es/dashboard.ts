type ChangeType = "up" | "down" | "same";

export const dashboardTexts = {
  main: {
    title: "Dashboard",
    description:
      "Toma decisiones informadas con una vista general de tu situación financiera basada en {{fileName}}.",
  },
  cards: {
    balance: {
      up: {
        title: "Balance actual",
        description: (value: number) =>
          `Aumentó un ${value.toFixed(1)}% este mes`,
        sub: "Balance neto después de todas las transacciones",
      },
      down: {
        title: "Balance actual",
        description: (value: number) =>
          `Disminuyó un ${Math.abs(value).toFixed(1)}% este mes`,
        sub: "Balance neto después de todas las transacciones",
      },
      same: {
        title: "Balance actual",
        description: () => `Sin cambios este mes`,
        sub: "Balance neto después de todas las transacciones",
      },
    },

    incomes: {
      up: {
        title: "Ingresos actuales",
        description: (value: number) =>
          `Aumentaron un ${value.toFixed(1)}% respecto al mes pasado`,
        sub: "Total de ingresos recibidos en este periodo",
      },
      down: {
        title: "Ingresos actuales",
        description: (value: number) =>
          `Disminuyeron un ${Math.abs(value).toFixed(
            1
          )}% respecto al mes pasado`,
        sub: "Total de ingresos recibidos en este periodo",
      },
      same: {
        title: "Ingresos actuales",
        description: () => `Ingresos iguales al mes anterior`,
        sub: "Total de ingresos recibidos en este periodo",
      },
    },

    expenses: {
      up: {
        title: "Egresos actuales",
        description: (value: number) =>
          `Aumentaron un ${value.toFixed(1)}% este mes`,
        sub: "Incluye todos los egresos registrados",
      },
      down: {
        title: "Egresos actuales",
        description: (value: number) =>
          `Disminuyeron un ${Math.abs(value).toFixed(1)}% este mes`,
        sub: "Incluye todos los egresos registrados",
      },
      same: {
        title: "Egresos actuales",
        description: () => `Sin cambios en egresos`,
        sub: "Incluye todos los egresos registrados",
      },
    },

    spendingRate: {
      up: {
        title: "% de Ingresos Gastados",
        description: (value: number) =>
          `Subió a ${value.toFixed(1)}% del ingreso`,
        sub: "Mayor porcentaje indica menor ahorro",
      },
      down: {
        title: "% de Ingresos Gastados",
        description: (value: number) =>
          `Bajó a ${value.toFixed(1)}% del ingreso`,
        sub: "Menor porcentaje significa mayor ahorro",
      },
      same: {
        title: "% de Ingresos Gastados",
        description: (value: number) =>
          `Se mantuvo en ${value.toFixed(1)}% del ingreso`,
        sub: "Proporción estable de gasto vs ingreso",
      },
    },
  },

  linechart: {
    title: "Flujo Diario de Ingresos y Gastos",
    description:
      "Este gráfico muestra el flujo diario de ingresos y gastos en {{fileName}}.",
    time: "Mostrando ingresos y egresos de los últimos {{timeSleep}}",
    trendMessages: {
      up: "Tendencia al alza del {{percentage}} por ciento",
      down: "Tendencia a la baja del {{percentage}} este mes",
      same: "Sin cambios significativos este mes",
    },
  },

  piechart: {
    incoming: {
      title: "Distribución de Ingresos",
      time: "Periodo {{timeRange}}",
      trendMessages: {
        up: "Los ingresos aumentaron un {{percentage}} este mes",
        down: "Los ingresos disminuyeron un {{percentage}} este mes",
        same: "Los ingresos no cambiaron este mes",
      },
      sub: "Total acumulado del ultimo mes",
    },
    expenses: {
      title: "Distribución de Egresos",
      time: "Periodo {{timeRange}}",
      trendMessages: {
        up: "Los egresos aumentaron un {{percentage}} este mes",
        down: "Los egresos disminuyeron un {{percentage}} este mes",
        same: "Los egresos no cambiaron este mes",
      },
      sub: "Total acumulado del ultimo mes",
    },
  },

  barchart: {
    balance: {
      title: "Balance General",
      time: "Periodo {{timeRange}}",
      trendMessages: {
        up: "El balance aumentó un {{percentage}} este mes",
        down: "El balance disminuyó un {{percentage}} este mes",
        same: "El balance no cambió este mes",
      },
      sub: "Balance de este mes",
    },
  },
};
