export function LayoutAccountsMenu({
  children,
}: {
  children: React.ReactNode;
}) {
  const Accounts = [
    { label: "Activo:Caja", mount: 200 },
    { label: "Activo:Bancos", mount: 450 },
    { label: "Activo:Inventario", mount: 1230 },
    { label: "Pasivo:Deudas", mount: -500 },
    { label: "Capital:Inversiones", mount: 3000 },
  ];

  return (
    <>
      
      <div className="p-4 sm:ml-64">
        <h1>COntent ....</h1>
      </div>
    </>
  );
}
