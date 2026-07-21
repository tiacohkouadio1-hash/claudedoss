#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Réplique les formules du classeur pour vérifier les valeurs attendues."""
import math

# Hypothèses
PRODUCTIBLE=1400; DEGR=0.007; WC=500; M2=6.5; TARIF0=80; INFL=0.03; OM=0.015; DUREE=25; ACTU=0.08
CFG={"B1":dict(cost=700000,auto=0.65,ond=0.08,bat=0.00),
     "B2":dict(cost=1500000,auto=0.90,ond=0.08,bat=0.30),
     "B3":dict(cost=1100000,auto=0.80,ond=0.08,bat=0.15)}
# Cas client
FACT=45000; TARIF=TARIF0; COUV=0.80
conso_mois=FACT/TARIF; conso_an=conso_mois*12; conso_couv=conso_an*COUV
kwc=conso_couv/PRODUCTIBLE; panneaux=math.ceil(kwc*1000/WC); surface=kwc*M2
print("=== Cas client ===")
print(f"Conso annuelle   : {conso_an:,.0f} kWh")
print(f"Puissance        : {kwc:.2f} kWc  | {panneaux} panneaux | {surface:.1f} m²")

def npv(rate, flows):  # flows: années 1..25
    return sum(f/(1+rate)**i for i,f in enumerate(flows, start=1))

print("\n=== Comparatif & cash-flow ===")
for code,p in CFG.items():
    capex=kwc*p["cost"]
    prod1=kwc*PRODUCTIBLE
    auto1=min(prod1*p["auto"], conso_an)
    eco1=auto1*TARIF
    om1=capex*OM
    net1=eco1-om1
    payback=capex/net1
    # cash-flow 25 ans
    cum=-capex; flows=[]; year_rentable=None
    for n in range(1,26):
        prod=kwc*PRODUCTIBLE*(1-DEGR)**(n-1)
        tarif=TARIF0*(1+INFL)**(n-1)
        auto=min(prod*p["auto"], conso_an)
        eco=auto*tarif
        om=capex*OM
        rempl=(capex*p["bat"] if n==10 else 0)+(capex*p["ond"] if n==12 else 0)
        net=eco-om-rempl
        flows.append(net)
        prev=cum; cum+=net
        if prev<0<=cum and year_rentable is None: year_rentable=n
    van=npv(ACTU,flows)-capex
    print(f"\n{code}: CAPEX {capex:,.0f} | Éco nette an1 {net1:,.0f} | "
          f"Payback brut {payback:.1f} ans | Rentable an {year_rentable} | "
          f"VAN25 {van:,.0f} | Cumulé25 {cum:,.0f}")
