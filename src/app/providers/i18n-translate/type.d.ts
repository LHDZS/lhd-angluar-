import { title } from 'process';

/** 国际化TS */
export declare interface I18N {
    request: {
        error: {
            unknow: string;
        };
    };
    SowEarNumber: any;
    component: {
        insertRowAbove: string;
        insertRowBelow: string;
        copyRowToTop: string;
        copyLineToBottom: string;
        deleteCurrentRow: string;
        addRows: string;
        emptyDataCannotBeSaved: string;
        pleaseCheckYourInput: string;
        unableToOperate: string;
        tips: string;
        confirm: string;
        cancel: string;
    };
    commandOptions: {
        line: {
            prefix: string;
            suffix: string;
        };
        create: {
            text: string;
            success: string;
            failed: string;
        };
        edittext: string;
        delete: {
            text: string;
            success: string;
            failed: string;
            confirm: string;
            confirmTitle: string;
            confirmFormat: string;
            emptyMessage: string;
            confirmFormatMore: string;
        };
        examine: {
            text: string;
            success: string;
            failed: string;
            confirm: string;
            confirmTitle: string;
            confirmFormat: string;
            emptyMessage: string;
            noRights: string;
        };
        search: {
            text: string;
        };
        edit: {
            text: string;
            success: string;
            failed: string;
        };
        save: {
            text: string;
            success: string;
            failed: string;
            noChange: string;
            error: string;
        };
        reset: {
            text: string;
        };
        cancel: {
            text: string;
        };
        headSetting: {
            text: string;
        };
        auditStatus: {
            text: string;
            yes: string;
            no: string;
        };
        submit: {
            text: string;
            success: string;
            failed: string;
            confirm: string;
            confirmTitle: string;
            noRights: string;
        };
        fsubmit: {
            text: string;
            success: string;
            failed: string;
            confirm: string;
            confirmTitle: string;
        };
        transfer: {
            text: string;
            success: string;
            failed: string;
            confirm: string;
            confirmTitle: string;
            noRights: string;
        };
        ftransfer: {
            text: string;
            success: string;
            failed: string;
            confirm: string;
            confirmTitle: string;
        };
        CreatedOwnerName: {
            text: string;
        };
        OwnerName: {
            text: string;
        };
        AuditName: {
            text: string;
        };
        IsCheck: {
            text: string;
        };
        PersonID: {
            text: string;
        };
        CreatedDate: {
            text: string;
        };
        ModifiedDate: {
            text: string;
        };
        AuditDate: {
            text: string;
        };
    };
    required: string;
    pageCommonProperty: {
        remarks: {
            text: string;
            overLengthMessage: string;
        };
    };
    pigDataDictionary: {
        batchModeNotAll: string;
        batchModeAll: string;
        pigHouseType: string;
        pigHouse: string;
        batchNumber: string;
        pigFarm: string;
        batchStatusEnded: string;
        batchStatusNotEnded: string;
    };
    dataGridOptions: {
        rowOptions: {
            add: {
                text: string;
            };
            delete: {
                text: string;
            };
        };
        remarks: {
            text: string;
            placeholder: string;
        };
        summary: {
            sum: {
                text: string;
            };
        };
    };
    printComponent: {
        notSavedMessage: string;
        noData: string;
    };
    importComponent: {
        text: string;
        importTemplateTitle: string;
        archives: string;
    };
    pedigreeimportComponent: {
        text: string;
    };
    commonColumns: {
        status: {
            text: string;
        };
        isFinish: {
            text: string;
        };
        isInState: {
            text: string;
        };
        number: {
            text: string;
        };
        numericalOrderParent: {
            text: string;
        };
        numericalOrder: {
            text: string;
        };
        numericalOrderDetail: {
            text: string;
        };
        createdOwnerName: {
            text: string;
        };
        ownerName: {
            text: string;
        };
        createdDate: {
            text: string;
        };
        modifiedDate: {
            text: string;
        };
        auditName: {
            text: string;
        };
        financeAuditName: {
            text: string;
        };
        warehouseAuditName: {
            text: string;
        };
        auditDate: {
            text: string;
        };
        financeAuditDate: {
            text: string;
        };
        dataDate: {
            text: string;
        };
        code: {
            text: string;
            requiredMessage: string;
            placeholder: string;
            placeholderAuto: string;
        };
        earNumber: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
            placeholder: string;
            rangeMessage: string;
            stringLengthMessage: string;
            earTip: string;
        };
        breedingFarmIdentifiy: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
            placeholder: string;
            placeholderAuto: string;
            rangeMessage: string;
            tip: string;
        };
        earNumberShortage: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
            placeholder: string;
            rangeMessage: string;
            tip: string;
        };
        sowEarNumber: {
            text: string;
            emptyMessage: string;
            requiredMessage: string;
        };
        fatBatch: {
            text: string;
            requiredMessage: string;
        };
        sowBatch: {
            text: string;
            requiredMessage: string;
            batchMessage: string;
        };
        sowdetails: {
            text: string;
        };
        pigHouseUnitId: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        pigField: {
            text: string;
        };
        gender: {
            text: string;
        };
        genderZhongZhu: {
            text: string;
            requiredSelect: string;
        };
        grade: {
            text: string;
        };
        productName: {
            text: string;
        };
        varietiesName: {
            text: string;
            placeholder: string;
            requiredMessage: string;
        };
        strainName: {
            text: string;
            placeholder: string;
            requiredMessage: string;
        };
        pigTotalWeight: {
            text: string;
            sowsText: string;
            noUnit: string;
            requiredMessage: string;
            rangeMessage: string;
            patternMessage: string;
            emptyMessage: string;
        };
        boarEarNumber: {
            text: string;
            boarDetail: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        currentPigHouseUnit: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        currentPigField: {
            text: string;
        };
        turnInPigHouseUnit: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        turnOutPigHouseUnit: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        turnInPigField: {
            text: string;
        };
        turnOutBatch: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        turnInBatch: {
            text: string;
            requiredMessage: string;
        };
        InBatch: {
            text: string;
            requiredMessage: string;
        };
        pigCount: {
            text: string;
            numericMessage: string;
            rangeMessage: string;
            patternMessage: string;
        };
        personName: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        breedingDate: {
            text: string;
        };
        birthDate: { text: string };
        NoData: {
            text: string;
        };
        isFinishOver: {
            text: string;
        };
        warehouseReviewer: {
            text: string;
        };
        warehouseReviewDate: {
            text: string;
        };
        financeReviewer: {
            text: string;
        };
        financeReviewDate: {
            text: string;
        };
        warehouseReview: {
            text: string;
        };
        financeReview: {
            text: string;
        };
        cancelReview: {
            text: string;
        };
        financeNotReview: {
            text: string;
        };
        financeHasReview: {
            text: string;
        };
        warehouseNotReview: {
            text: string;
        };
        warehouseHasReview: {
            text: string;
        };
        notReview: {
            text: string;
        };
        hasReview: {
            text: string;
        };
        all: {
            text: string;
        };
        noRight: {
            text: string;
        };
        firstReview: {
            text: string;
        };
        firstCancelreview: {
            text: string;
        };
        company: {
            text: string;
        };
        farm: {
            text: string;
        };
        producer: {
            text: string;
        };
        warehouse: {
            text: string;
        };
        finance: {
            text: string;
        };
        auditControll: {
            text: string;
        };
        cancelAudit: {
            text: string;
        };
        positiveNumberValidate: {
            numericMessage: string;
            rangeMessage: string;
            patternMessage: string;
        };
        positiveNumberFix2: {
            numericMessage: string;
            rangeMessage: string;
            patternMessage: string;
        };
        positiveBigNumberFix: {
            numericMessage: string;
            rangeMessage: string;
            patternMessage: string;
        };
        hbsowfile: string;
        hbboarfile: string;
        hbfile: string;
        turninboarbatch: string;
        pedigree: {
            FpigNumber: string;
            GfpigNumber: string;
            GmpigNumber: string;
            GffpigNumber: string;
            GfmpigNumber: string;
            GmfpigNumber: string;
            GmmpigNumber: string;
            MpigNumber: string;
            MgfpigNumber: string;
            MgmpigNumber: string;
            MgffpigNumber: string;
            MgfmpigNumber: string;
            MgmfpigNumber: string;
            MgmmpigNumber: string;
        };
        historyPig: {
            text: string;
            tip: string;
        };
        fileType: {
            text: string;
            placeholder: string;
            requiredSelect: string;
        };
        sourceType: {
            text: string;
        };
    };
    boarAllocation: {
        title: string;
        boarBatch: {
            text: string;
            requiredMessage: string;
        };
        allocationInBatch: {
            text: string;
            requiredMessage: string;
        };
        dataDate: {
            text: string;
            emptyValidationMessage: string;
        };
        personName: {
            text: string;
            emptyValidationMessage: string;
        };
        Notify: string;
        createPageTitle: string;
        editPageTitle: string;
        associatedEarNumber: string;
    };
    batchSetting: {
        baseInfo: string;
        relationNumber: {
            text: string;
        };
        relationBatch: {
            text: string;
            success: string;
            failed: string;
            info: string;
        };
        batchForm: {
            text: string;
        };
        beginDate: {
            text: string;
            placeholder: string;
            requiredMessage: string;
        };
        endDate: {
            text: string;
            placeholder: string;
            requiredMessage: string;
        };
        finishDate: {
            text: string;
        };
        isFinish: {
            text: string;
            trueText: string;
            falseText: string;
        };
        batchType: {
            text: string;
            placeholder: string;
            requiredMessage: string;
        };
        productName: {
            text: string;
            placeholder: string;
            requiredMessage: string;
        };
        batchName: {
            text: string;
            placeholder: string;
            requiredMessage: string;
            capacity_range: string;
        };
        remarks: {
            text: string;
            placeholder: string;
            capacity_range: string;
        };
    };
    boarBatchSetting: {
        earNumber: string;
        productID: string;
        category: string;
        column: string;
        title: string;
        relationSowTitle: string;
        status: {
            text: string;
        };
        pigHouseUnitName: {
            text: string;
        };
        relationNumber: {
            text: string;
            success: string;
        };
        finish: {
            trueText: string;
            falseText: string;
        };
        pigField: {
            text: string;
        };
        dataDate: {
            text: string;
        };
        relation: {
            text: string;
        };

        days: {
            text: string;
        };

        page: {
            text: string;
            footer: string;
        };

        beginDate: {
            text: string;
            placeholder: string;
            requiredMessage: string;
        };
        endDate: {
            text: string;
            placeholder: string;
            requiredMessage: string;
        };
        finishDate: {
            text: string;
        };
        isFinish: {
            text: string;
            trueText: string;
            falseText: string;
        };

        batchForm: {
            text: string;
        };
        batch: {
            name: string;
            retreatBegin: string;
            selectBegin: string;
            retreatEnd: string;
            selectEnd: string;
            end: string;
            rangeMessage: string;
            requiredMessage: string;
        };
        IsItOver: {
            text: string;
        };
        remarks: {
            text: string;
            placeholder: string;
        };
        basicInformation: {
            text: string;
        };
        createPageTitle: string;
        editPageTitle: string;
    };
    death: {
        dataDate: {
            text: string;
        };
        deathTypeId: {
            text: string;
            requiredMessage: string;
            items: {
                death: string;
                other: string;
            };
            emptyMessage: string;
        };
        deathReasonId: {
            text: string;
            requiredMessage: string;
            emptyMesage: string;
        };
        deathDescription: {
            text: string;
            stringLengthMessage: string;
        };
        deathCount: {
            text: string;
            requiredMessage: string;
        };
    };
    boarDeath: {
        title: string;
        batchName: {
            text: string;
            requiredMessage: string;
        };
        createPageTitle: string;
        editPageTitle: string;
    };
    feed: {
        dataDate: {
            text: string;
        };
        feedType: {
            text: string;
            placeholder: string;
        };
        feedObject: {
            text: string;
            emptyMessage: string;
        };
        productName: {
            text: string;
            emptyMessage: string;
            emptySelect: string;
        };
        specification: {
            text: string;
        };
        standardMeasureUnit: {
            text: string;
        };
        quantity: {
            text: string;
            requiredMessage: string;
            rangeMessage: string;
            emptyMessage: string;
        };
        personId: {
            text: string;
        };
        sowFeeding: {
            text: string;
        };

        earTag: {
            text: string;
            placeholder: string;
        };

        parity: {
            text: string;
        };
        hisParity: {
            text: string;
        };
        inState: {
            text: string;
        };
        pigHouseUnitId: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        createPageTitle: string;
        editPageTitle: string;
    };
    boarFeed: {
        title: string;
        createPageTitle: string;
        editPageTitle: string;
    };
    pigFile: {
        earTag: {
            text: string;
            placeholder: string;
        };
        inState: {
            text: string;
        };
        pigState: {
            text: string;
        };
        baseInfoTitle: string;
        birthInfoTitle: string;
        pedigreeInfoTitle: string;
        birthDate: {
            text: string;
            placeholder: string;
        };
        dateOfEntry: {
            text: string;
        };
        birthPlace: {
            text: string;
        };
        birthUnitWeight: {
            text: string;
            patternMessage: string;
        };
        weaningDays: {
            text: string;
            patternMessage: string;
        };
        leftNippleCount: {
            text: string;
            patternMessage: string;
        };
        rightNippleCount: {
            text: string;
            patternMessage: string;
        };
        weaningUnitWeight: {
            text: string;
            patternMessage: string;
        };
        remarks: {
            text: string;
            placeholder: string;
        };
        pedigreeRecord: string;
        grade: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
    };
    boarFile: {
        title: string;
        createPageTitle: string;
        editPageTitle: string;
        pigEarNumber: string;
        earDefect: {
            text: string;
            rangeMessage: string;
        };
        strainName: {
            text: string;
            placeholder: string;
            requiredMessage: string;
            requiredSelect: string;
        };
        varietiesName: {
            text: string;
            placeholder: string;
            requiredMessage: string;
            requiredSelect: string;
        };
        alreadyProducedParity: {
            text: string;
            requiredMessage: string;
            patternMessage: string;
        };
        productName: {
            text: string;
            placeholder: string;
            requiredMessage: string;
            goodsText: string;
            goodsplaceholder: string;
            goodsAdd: string;
        };
        earTag: {
            text: string;
            placeholder: string;
        };
        birthDate: {
            text: string;
            placeholder: string;
            requiredMessage: string;
        };
        dateOfEntry: {
            text: string;
        };
        birthPlace: {
            text: string;
        };
        birthUnitWeight: {
            text: string;
            patternMessage: string;
        };
        weaningDays: {
            text: string;
            patternMessage: string;
        };
        leftNippleCount: {
            text: string;
            patternMessage: string;
        };
        rightNippleCount: {
            text: string;
            patternMessage: string;
        };
        weaningUnitWeight: {
            text: string;
            patternMessage: string;
        };
        remarks: {
            text: string;
            placeholder: string;
        };
        boarType: {
            text: string;
            tip: string;
        };
        notAllow: {
            text: string;
        };
        XP1: string;
        XP2: string;
        XP3: string;
    };
    boarKnockOut: {
        title: string;
        dataDate: {
            text: string;
        };
        batchName: {
            text: string;
        };
        isLeave: {
            text: string;
            trueText: string;
            falseText: string;
            requiredMessage: string;
        };
        deathReasonId: {
            text: string;
            requiredMessage: string;
        };
        createPageTitle: string;
        editPageTitle: string;
    };
    nitial: {
        dataDate: {
            text: string;
        };
        pigHouseUnitId: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        pigCount: {
            text: string;
            requiredMessage: string;
            rangeMessage: string;
            patternMessage: string;
            emptyMessage: string;
        };
        pigTotalWeight: {
            text: string;
            noUnit: string;
            rangeMessage: string;
            patternMessage: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        pigHouseUnitName: {
            text: string;
        };
        sowtitle: {
            text: string;
        };
    };
    boarNitial: {
        title: string;
        pigHouseUnitName: {
            text: string;
        };
        createPageTitle: string;
        editPageTitle: string;
    };
    sowNitial: {
        title: string;
        dataDate: {
            text: string;
        };
        pigHouseUnitName: {
            text: string;
        };
        weight: {
            text: string;
            noUnit: string;
            rangeMessage: string;
            patternMessage: string;
            requiredMessage: string;
        };
        createPageTitle: string;
        editPageTitle: string;
    };
    sowPregnancyplan: {
        totalNumber: {
            text: string;
        };

        totalWeight: {
            text: string;
        };
        pigHouseUnitName: {
            text: string;
        };
        lastEvent: {
            text: string;
        };
        pregnancyDays: {
            text: string;
        };
        dayUnit: {
            text: string;
        };
        pregnancyPlan: {
            text: string;
        };
        dataDate: {
            text: string;
            requiredMessage: string;
        };
        pregnancyRecord: {
            text: string;
            eidt: string;
            add: string;
        };
        taskStatus: {
            text: string;
        };
        pushOrNot: {
            text: string;
            push: string;
            yes: string;
            no: string;
        };

        waring: {
            text: string;
        };
        createPageTitle: string;
        editPageTitle: string;
    };

    turn: {
        dataDate: {
            text: string;
        };
        inbatchType: {
            text: string;
        };
    };
    boarTurn: {
        title: string;
        batchName: {
            text: string;
        };
        createPageTitle: string;
        editPageTitle: string;
    };
    semenCollection: {
        semenBatch: {
            text: string;
        };
        dataDate: {
            text: string;
        };
        semenQuantity: {
            text: string;
            rangeMessage: string;
            fixedMessage: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        semenColor: {
            text: string;
        };
        semenSmell: {
            text: string;
        };
        spermVitality: {
            text: string;
            rangeMessage: string;
            fixedMessage: string;
            systemInfo: string;
        };
        spermDensity: {
            text: string;
            rangeMessage: string;
            fixedMessage: string;
        };
        deformityRate: {
            text: string;
            rangeMessage: string;
            fixedMessage: string;
        };
        spermVitalityAfter: {
            text: string;
            rangeMessage: string;
            fixedMessage: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        dilutedCopies: {
            text: string;
            rangeMessage: string;
            patternMessage: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        personName: {
            text: string;
            emptyMessage: string;
        };
        warehouseId: {
            text: string;
            emptyMessage: string;
        };
        createdOwnerName: {
            text: string;
        };
        productId: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
            headerHelpMessage: string;
        };
        qiwei: {
            text: string;
        };
        yanshe: {
            text: string;
        };
    };
    boarSemenCollection: {
        title: string;
        createPageTitle: string;
        editPageTitle: string;
        createOwnerName: string;
        createDateTime: string;
        modifiedName: string;
        modifiedDateTime: string;
    };
    reserveSemenCollection: {
        title: string;
        fatBathId: {
            text: string;
            requiredMessage: string;
        };
        createPageTitle: string;
        editPageTitle: string;
    };
    reserveTurnBoar: {
        title: string;
        dataDate: {
            text: string;
        };
        averageAge: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        createPageTitle: string;
        editPageTitle: string;
    };
    costCollection: {
        title: string;
        beginDate: {
            text: string;
        };
        endDate: {
            text: string;
        };
        mounth: {
            text: string;
            emptyMessage: string;
        };
        setAccountingInterval: string;
        notionalPoolingTypeName: {
            text: string;
            notChooseMessage: string;
            emptyMessage: string;
        };
        CostProjectTypeName: {
            text: string;
            notChooseMessage: string;
            emptyMessage: string;
        };
        notionalPoolingObject: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        CostProjectID: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        subject: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        expenses: {
            text: string;
            requiredMessage: string;
            numericMessage: string;
            rangeMessage: string;
            patternMessage: string;
            emptyMessage: string;
        };
        createPageTitle: string;
        editPageTitle: string;
        notSetAccountingInterval: string;
    };
    costDepositcost: {
        title: string;
        earNumber: {
            text: string;
        };
        pigCost: {
            text: string;
            rangeMessage: string;
            patternMessage: string;
            emptyMessage: string;
        };
        materialCost: {
            text: string;
            rangeMessage: string;
            patternMessage: string;
            emptyMessage: string;
            column: string;
        };
        medicantCost: {
            text: string;
            rangeMessage: string;
            patternMessage: string;
            emptyMessage: string;
            column: string;
        };
        vaccineCost: {
            text: string;
            rangeMessage: string;
            patternMessage: string;
            emptyMessage: string;
            column: string;
        };
        expensesCost: {
            text: string;
            rangeMessage: string;
            patternMessage: string;
            emptyMessage: string;
            column: string;
        };
        dataDate: {
            text: string;
        };
        createPageTitle: string;
        editPageTitle: string;
        earNumberBatch: string;
        verificationTips: string;
        sowdetails: {
            text: string;
        };
    };
    costoriginal: {
        title: string;
        createPageTitle: string;
        editPageTitle: string;
        dataDate: {
            text: string;
        };
        originalValue: {
            text: string;
            rangeMessage: string;
            patternMessage: string;
            emptyMessage: string;
        };
        originalValueUnit: {
            text: string;
            rangeMessage: string;
            depreciatedMessage: string;
            salvageValueMessage: string;
        };
        depreciatedMonths: {
            text: string;
            rangeMessage: string;
            patternMessage: string;
            emptyMessage: string;
        };
        residualRate: {
            text: string;
            rangeMessage: string;
            patternMessage: string;
            emptyMessage: string;
        };
        salvageValue: {
            text: string;
            rangeMessage: string;
            patternMessage: string;
            emptyMessage: string;
        };
        salvageValueUnit: {
            text: string;
            rangeMessage;
        };
        residualValueMethod: {
            text: string;
            message: string;
        };
        depreciationMonths: {
            text: string;
            rangeMessage: string;
            patternMessage: string;
            emptyMessage: string;
        };
        depreciated: {
            text: string;
            rangeMessage: string;
            patternMessage: string;
            emptyMessage: string;
        };
        beginDate: {
            text: string;
            emptyMessage: string;
        };
    };
    fatBatchSetting: {
        title: string;
        createPageTitle: string;
        editPageTitle: string;
        batchForm: {
            text: string;
        };
        beginDate: {
            text: string;
            placeholder: string;
            requiredMessage: string;
        };
        endDate: {
            text: string;
            placeholder: string;
            requiredMessage: string;
        };
        inAvgDate: {
            text: string;
        };
        inAvgAge: {
            text: string;
        };
        avgInAge: {
            text: string;
        };
        finishDate: {
            text: string;
        };
        batchType: {
            text: string;
            placeholder: string;
            requiredMessage: string;
        };
        IsEnd: {
            text: string;
            yes: string;
            no: string;
        };
        basicInformation: {
            text: string;
        };
        productName: {
            text: string;
            TooltipTitle: string;
            placeholder: string;
            requiredMessage: string;
        };
        goodsName: {
            text: string;
            TooltipTitle: string;
            placeholder: string;
            requiredMessage: string;
        };
        remarks: {
            text: string;
            placeholder: string;
            capacity_range: string;
        };
        batchName: {
            text: string;
            placeholder: string;
            requiredMessage: string;
            capacity_range: string;
        };
        FatDateAge: {
            text: string;
        };
        InventoryCount: {
            text: string;
        };
        tipDate: string;
    };
    immunityRecord: {
        title: string;
        dataDate: {
            text: string;
            requiredMessage: string;
        };
        immuneTypeName: {
            text: string;
            requiredMessage: string;
        };
        days: {
            text: string;
            label: string;
        };
        immuneProjectName: {
            text: string;
            requiredMessage: string;
        };
        immunePlanName: {
            text: string;
            choice: string;
            choicePlan: string;
        };
        productName: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        quantity: {
            text: string;
            rangeMessage: string;
            patternMessage: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        dosageUnit: {
            text: string;
        };
        wayName: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        pigHouseUnitName: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        pigName: {
            text: string;
        };
        numericalOrderPlan: {
            text: string;
            choice: string;
            planDate: string;
            immunityWayName: string;
            immunitycaption: string;
            OrderDate: string;
            choicePlan: string;
        };
        personName: {
            text: string;
            requiredMessage: string;
        };
        createPageTitle: string;
        editPageTitle: string;
    };
    semenBatchSet: {
        title: string;
        noSystemOption: string;
        noSystemOptionTip: string;
        semenBatchName: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        productName: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        isUse: {
            text: string;
            trueText: string;
            falseText: string;
            emptyMessage: string;
        };
        remarks: {
            text: string;
            placeholder: string;
        };
        createPageTitle: string;
        editPageTitle: string;
    };
    healthCareSetting: {
        title: string;
        dataDate: {
            text: string;
            emptyMessage: string;
        };
        pigTypeName: {
            text: string;
        };
        immuneTypeName: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        days: {
            text: string;
            rowEmptyMessage: string;
            rowNumericMessage: string;
        };
        setDataDate: {
            text: string;
            rowEmptyMessage: string;
        };
        pigType: {
            text: string;
            choosePigType: string;
            emptyMessage: string;
            requiredMessage: string;
        };
        immuneProjectName: {
            text: string;
            requiredMessage: string;
            headerHelpMessage: string;
            emptyMessage: string;
        };
        createPageTitle: string;
        editPageTitle: string;
    };
    houseSetting: {
        title: string;
        pigHouseUnitType: {
            text: string;
            placeholder: string;
            requiredMessage: string;
        };
        isUse: {
            text: string;
            trueText: string;
            falseText: string;
            emptyMessage: string;
        };
        capacity: {
            text: string;
            message: string;
            placeholder: string;
            capacity_number: string;
            capacity_range: string;
            capacity_onlyNumber: string;
            emptyMessage: string;
        };
        personName: {
            text: string;
            placeholder: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        PigHouseUnitType: {
            message: string;
        };
        pigHouseUnitName: {
            text: string;
            placeholder: string;
            requiredMessage: string;
            message: string;
            emptyMessage: string;
        };
        remarks: {
            text: string;
            placeholder: string;
        };
        createPageTitle: string;
        editPageTitle: string;
    };
    fieldSetting: {
        pigFieldName: {
            text: string;
            placeholder: string;
            requiredMessage: string;
            message: string;
            emptyMessage: string;
        };
        pigHouseName: {
            text: string;
        };
        create: {
            title: string;
        };
        edit: {
            title: string;
        };
        deletecontroll: {
            text: string;
        };
    };
    immuneProgramSetting: {
        title: string;
        dataDate: {
            text: string;
            emptyMessage: string;
        };
        pigTypeName: {
            text: string;
            choosePigTypeMessage: string;
            emptyMessage: string;
            requiredMessage: string;
        };
        ImmuneType: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        days: {
            text: string;
            rowEmptyMessage: string;
            rowNumericMessage: string;
        };
        setDataDate: {
            text: string;
            rowEmptyMessage: string;
        };
        immuneProjectName: {
            text: string;
            headerHelpMessage: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        createPageTitle: string;
        editPageTitle: string;
    };
    pigFarmSetting: {
        title: string;
        PigFarmId: {
            text: string;
        };
        PigFarmFullName: {
            text: string;
            placeholder: string;
            requiredMessage: string;
            capacity_range: string;
            limitCharacterMessage: string;
        };
        PigFarmName: {
            text: string;
            placeholder: string;
            requiredMessage: string;
            capacity_range: string;
            limitCharacterMessage: string;
        };
        PigFarmCode: {
            text: string;
            placeholder: string;
            requiredMessage: string;
            capacity_range: string;
            limitCharacterMessage: string;
        };
        ScaleOfPigFarm: {
            text: string;
            placeholder: string;
            requiredMessage: string;
        };
        CultureMode: {
            text: string;
            placeholder: string;
            requiredMessage: string;
        };
        PigFarmAddress: string;
        Begindate: {
            text: string;
            requiredMessage: string;
        };
        PersonId: {
            text: string;
            placeholder: string;
            requiredMessage: string;
        };
        Address: {
            text: string;
            placeholder: string;
        };
        IsUse: {
            text: string;
            trueText: string;
            falseText: string;
        };
        region: {
            province: string;
            city: string;
            CountyOrDistrict: string;
        };
        pigWarehouse: {
            text: string;
        };
        materialWarehouse: {
            text: string;
        };
        printQuantityPerLine: string;
        basicInformation: string;
        pigFarmProperties: string;
        other: string;
        skipToWarehousePage: string;
        createPageTitle: string;
        editPageTitle: string;
        addressMessage: string;
        farmAddress: string;
        province: string;
        city: string;
        area: string;
        createSuccess: string;
        addFarm: string;
        initialSettings: string;
        CreatedOwnerId: string;
        selectInitDate: string;
        initDate: string;
        tip: string;
        warn: string;
        CreatedDate: string;
        OwnerId: string;
        ModifiedDate: string;
        noPigFarm: string;
        noPigFarmTip: string;
        title1: string;
        title2: string;
        title3: string;
        title4: string;
        title5: string;
        pigfarmaddressmust: string;
        mustitem: string;
        cancle: string;
        save: string;
        sure: string;
        saveandnew: string;
        waretip: string;
        kuaijishezhi: string;
        cangkushezhi: string;
    };
    typeSetting: {
        title: string;
        chooseOneMessage: string;
        reminName: {
            text: string;
            requiredMessage: string;
            stringLengthMessage: string;
            limitCharacterMessage: string;
        };
        relation: {
            text: string;
            requiredMessage: string;
        };
        relationValue: {
            text: string;
            requiredMessage: string;
            rangeMessage: string;
            patternMessage: string;
        };
        excellentValue: {
            text: string;
            requiredMessage: string;
            rangeMessage: string;
            patternMessage: string;
        };
        baselineValue: {
            text: string;
            requiredMessage: string;
            rangeMessage: string;
            patternMessage: string;
        };
        dataLevel: {
            text: string;
            requiredMessage: string;
        };
        isUse: {
            text: string;
            trueText: string;
            falseText: string;
        };
        remarks: {
            text: string;
            stringLengthMessage: string;
        };
        reminCode: {
            text: string;
            requiredMessage: string;
            stringLengthMessage: string;
            limitCharacterMessage: string;
            TipMessage: string;
        };
    };
    birthPrompt: {
        title: string;
        expectedDateOfChildbirth: {
            text: string;
        };
        breedingDate: {
            text: string;
        };
        daysOfPregnancy: {
            text: string;
        };
        childBirthButton: {
            text: string;
            DeliveryRecordNew: string;
            noSelectData: string;
            noPermission: string;
        };
        childBirthPlanButton: {
            text: string;
            DeliveryRecordNew: string;
            noSelectData: string;
            noPermission: string;
        };
        SowEarNumber: {
            text: string;
            HyperlinkTips: string;
        };
        PigHouseUnitName: string;
        PigField: string;
        TypeSetting: { text: string };
    };
    birthWarning: {
        title: string;
        SowEarNumber: {
            text: string;
            HyperlinkTips: string;
        };
        PigHouseUnitName: string;
        daysOfPregnancy: {
            text: string;
        };
        PigStateName: string;
        childBirthButton: {
            text: string;
            DeliveryRecordNew: string;
            noSelectData: string;
            noPermission: string;
        };
        childBirthPlanButton: {
            text: string;
            DeliveryRecordNew: string;
            noSelectData: string;
            noPermission: string;
        };
        TypeSetting: {
            text: string;
        };
    };
    breedingWarning: {
        title: string;
        SowEarNumber: {
            text: string;
            HyperlinkTips: string;
        };
        PigHouseUnitName: string;
        daysOfPregnancy: {
            text: string;
        };
        PigStateName: string;
        childbreedingButton: {
            text: string;
            DeliveryRecordNew: string;
            noSelectData: string;
            noPermission: string;
        };
        childbreedingPlanButton: {
            text: string;
            DeliveryRecordNew: string;
            noSelectData: string;
            noPermission: string;
        };
        TypeSetting: {
            text: string;
        };
    };
    weaningWarning: {
        title: string;
        SowEarNumber: {
            text: string;
            HyperlinkTips: string;
        };
        PigHouseUnitName: string;
        daysOfPregnancy: {
            text: string;
        };
        PigStateName: string;
        childweaningButton: {
            text: string;
            DeliveryRecordNew: string;
            noSelectData: string;
            noPermission: string;
        };
        childweaningPlanButton: {
            text: string;
            DeliveryRecordNew: string;
            noSelectData: string;
            noPermission: string;
        };
        TypeSetting: {
            text: string;
        };
    };
    pregnancyPrompt: {
        breedingButton: {
            text: string;
            noSelectData: string;
            noPermission: string;
        };
        days: {
            text: string;
        };
    };
    firstPregnancyPrompt: {
        title: string;
        EarNumber: string;
        SowDetail: string;
        PigHouseUnitName: string;
        PigField: string;
        Days: string;
        PregnancyButton: {
            text: string;
            PregnancyNew: string;
            noSelectData: string;
            noPermission: string;
        };
        PregnancyPlanButton: {
            text: string;
            PregnancyNew: string;
            noSelectData: string;
            noPermission: string;
        };
        TypeSetting: string;
    };
    promptSummary: {
        title: string;
        warningPrompt: string;
        weaning: string;
        breeding: string;
        birth: string;
        days: string;
        pigHouseUnitAndPigField: string;
        sowdetails: { text: string };
        tipsMessage: {
            TipsForMatching: string;
            TipsDelivery: string;
            TipsWeaning: string;
            TipsFirstPregnancy: string;
            TipsSecondPregnancy: string;
            TipsForDelivery: string;
        };
    };
    secondPregnancyPromp: {
        title: string;
        EarNumber: string;
        SowDetail: string;
        PigHouseUnitName: string;
        PigField: string;
        Days: string;
        PregnancyButton: {
            text: string;
            PregnancyNew: string;
            noSelectData: string;
            noPermission: string;
        };
        PregnancyPlanButton: {
            text: string;
            PregnancyNew: string;
            noSelectData: string;
            noPermission: string;
        };
        TypeSetting: string;
    };
    sowKnockOutPrompt: {
        title: string;
        describe: {
            text: string;
        };
        SowEarNumber: {
            text: string;
            HyperlinkTips: string;
            HyperlinkTipsBoar: string;
        };
        PigHouseUnitName: string;
        PigField: string;
        knockOutButton: {
            text: string;
            sowOutNew: string;
            boarOutNew: string;
            noSelectData: string;
            noPermission: string;
        };
        TypeSetting: string;
        VarietiesName: string;
        MaxParity: string;
        PigType: string;
        PigStateName: string;
        MonthAge: string;
        EliminateCount: string;
        EliminateReason: string;
    };
    sowKnockOut: {
        departureStatus: {
            text: string;
            requiredMessage: string;
            yes: string;
            no: string;
        };
        deathReasonId: {
            text: string;
            requiredMessage: string;
        };
        pigTotalWeight: {
            text: string;
            rangeMessage: string;
            patternMessage: string;
            requiredMessage: string;
        };
        eliminationDate: {
            text: string;
        };
        sowElimination: {
            text: string;
        };
        sowEliminationRecord: {
            text: string;
            yes: string;
            no: string;
        };
        createPageTitle: string;
        editPageTitle: string;
    };
    upperCotPrompt: {
        title: string;
        expectedDateOfChildbirth: {
            text: string;
        };
        SowEarNumber: {
            text: string;
            HyperlinkTips: string;
        };
        PigHouseUnitName: string;
        PigField: string;
        breedingDate: {
            text: string;
        };
        daysOfPregnancy: {
            text: string;
        };
        turnHouseButton: {
            text: string;
            sowTurnHouseNew: string;
            noSelectData: string;
            noPermission: string;
        };
        TypeSetting: string;
    };
    weaningPrompt: {
        title: string;
        SowEarNumber: {
            text: string;
            HyperlinkTips: string;
        };
        PigHouseUnitName: string;
        PigField: string;
        deliveryDate: {
            text: string;
        };
        daysOfLactation: {
            text: string;
        };
        breedingButton: {
            text: string;
            weaningNow: string;
            noSelectData: string;
            noPermission: string;
        };
        WeaningPlan: {
            text: string;
            weaningNow: string;
            noSelectData: string;
            noPermission: string;
        };
        TypeSetting: string;
    };
    withPrompt: {
        title: string;
        SowEarNumber: {
            text: string;
            HyperlinkTips: string;
        };
        PigHouseUnitName: string;
        PigField: string;
        pigState: {
            text: string;
        };
        dataDate: {
            text: string;
        };
        days: {
            text: string;
        };
        breedingButton: {
            text: string;
            breedingNew: string;
            noSelectData: string;
            noPermission: string;
        };
        breedingPlanButton: {
            text: string;
            breedingNew: string;
            noSelectData: string;
            noPermission: string;
        };
        TypeSetting: string;
    };
    backDetermination: {
        title: string;
        msBackfatDetermination: {
            text: string;
        };
        sowdetails: {
            text: string;
        };
        lastState: {
            text: string;
        };
        backFatIndex: {
            text: string;
            noUnit: string;
            rangeMessage: string;
            patternMessage: string;
            requiredMessage: string;
        };
        weight: {
            text: string;
            noUnit: string;
            rangeMessage: string;
            patternMessage: string;
            requiredMessage: string;
        };
        printComponent: {
            notSavedMessage: string;
            noData: string;
        };
        checkWeight: {
            text: string;
        };
        avgGlma: {
            text: string;
        };
        avgDlma: {
            text: string;
        };
        sowBatch: {
            text: string;
            batchMessage: string;
        };
        personName: {
            text: string;
            requiredMessage: string;
        };
        createPageTitle: string;
        editPageTitle: string;
    };
    hbSowBreeding: {
        title: string;
        dataDate: {
            text: string;
        };
        pigHouseUnit: {
            text: string;
        };
        lastState: {
            text: string;
        };
        lastDate: {
            text: string;
        };
        breedingMode: {
            title: string;
            text: string;
            requiredMessage: string;
        };
        firstBoar: {
            text: string;
            requiredMessage: string;
        };
        firstPro1: {
            text: string;
            requiredMessage: string;
        };
        firstPro2: {
            text: string;
            requiredMessage: string;
        };
        firstPro3: {
            text: string;
            requiredMessage: string;
        };
        score1: {
            text: string;
            requiredMessage: string;
            rangeMessage: string;
        };
        secondBoar: {
            text: string;
        };
        score2: {
            text: string;
            requiredMessage: string;
            rangeMessage: string;
        };
        thirdBoar: {
            text: string;
        };
        score3: {
            text: string;
            requiredMessage: string;
            rangeMessage: string;
        };
        personName: {
            text: string;
            requiredMessage: string;
        };
        sowdetails: {
            text: string;
        };
        sowBreedingRecords: {
            text: string;
        };
        sowBreeding: {
            text: string;
        };
        firstSemenBatch: {
            text: string;
        };
        secondSemenBatch: {
            text: string;
        };
        thirdSemenBatch: {
            text: string;
        };
        firstSemenUseCount: {
            text: string;
            rangeMessage: string;
        };
        secondSemenUseCount: {
            text: string;
            rangeMessage: string;
        };
        thirdSemenUseCount: {
            text: string;
            rangeMessage: string;
        };
        createPageTitle: string;
        editPageTitle: string;
        sowCreatePageTitle: string;
        sowEditPageTitle: string;
        sowTip: string;
        BreedingModeManual: string;
        sowshowTitle: string;
        selectproduct: string;
        selectware: string;
        selectproduct2: string;
        selectproduct3: string;
        earnobatch: string;
    };
    metaCheck: {
        title: string;
        dataDate: {
            text: string;
        };
        days: {
            text: string;
        };
        pregnancyWay: {
            text: string;
            requiredMessage: string;
        };
        pregnancyRecord: {
            text: string;
            eidt: string;
            add: string;
        };
        pregnancyResult: {
            text: string;
            requiredMessage: string;
        };
        pregnancyAbnormalDescription: {
            text: string;
            rangMessage: string;
        };
        personName: {
            text: string;
        };
        sowdetails: {
            text: string;
        };
        createPageTitle: string;
        editPageTitle: string;
    };
    pigPurchasing: {
        daitan: string;
        daitantip: string;
        title: string;
        titleOrder: {
            text: string;
        };
        dataDate: {
            text: string;
            emptyMessage: string;
        };
        ticketedPoint: {
            text: string;
            placeholder: string;
            emptyMessage: string;
        };
        typeName: {
            text: string;
            emptyMessage: string;
            placeholder: string;
        };
        supplierName: {
            text: string;
            emptyMessage: string;
            placeholder: string;
        };
        abstractName: {
            text: string;
            emptyMessage: string;
            placeholder: string;
        };
        pigName: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        purchaserName: {
            text: string;
            emptyMessage: string;
            placeholder: string;
        };
        wagonNumber: {
            text: string;
        };
        wareHouse: {
            text: string;
            emptyMessage: string;
            placeholder: string;
        };
        productName: {
            text: string;
            noProduct: string;
        };
        quantity: {
            text: string;
            numbericMessage: string;
            patternMessage: string;
            rangeMessage: string;
            emptyMessage: string;
        };
        adjustQuantity: {
            text: string;
            requiredMessage: string;
            numericMessage: string;
            rangeMessage: string;
            patternMessage: string;
            emptyMessage: string;
        };
        settlementQuantity: {
            text: string;
            requiredMessage: string;
            numericMessage: string;
            patternMessage: string;
            emptyMessage: string;
        };
        isGive: {
            text: string;
            trueText: string;
            falseText: string;
        };
        unitPriceTax: {
            text: string;
            numericlMessage: string;
            rangeMessage: string;
            patternMessage: string;
        };
        Amount: {
            text: string;
            requiredMessage: string;
            numericMessage: string;
            rangeMessage: string;
            patternMessage: string;
            emptyMessage: string;
        };
        unitDiscount: {
            text: string;
            numericMessage: string;
            rangeMessage: string;
            patternMessage: string;
        };
        amountAdjust: {
            text: string;
            requiredMessage: string;
            numericMessage: string;
            rangeMessage: string;
            patternMessage: string;
            emptyMessage: string;
        };
        amountTotal: {
            text: string;
        };
        packages: {
            text: string;
            emptyMessage: string;
        };
        pigTotalWeight: {
            text: string;
            requiredMessage: string;
            numericMessage: string;
            rangeMessage: string;
            patternMessage: string;
            emptyMessage: string;
        };
        pigType: {
            text: string;
            choosePigType: string;
            emptyMessage: string;
            placeholder: string;
        };
        pigDataDictionary: {
            batchModeNotAll: string;
            batchModeAll: string;
            pigHouseType: string;
            pigHouse: string;
            batchNumber: string;
            pigFarm: string;
            package: string;
        };
        pigHouse: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        isHb: {
            text: string;
            trueText: string;
            falseText: string;
        };
        specification: {
            text: string;
        };
        measureUnit: {
            text: string;
        };
        taxRate: {
            text: string;
        };
        noBindingProducts: {
            text: string;
        };
        paymentApplication: {
            text: string;
        };
        noRelevantdata: {
            text: string;
        };
        totalAmountlimit: {
            text: string;
        };
        purchaseOrder: {
            text: string;
        };
        averageAge: {
            text: string;
            requiredMessage: string;
            numericMessage: string;
            rangeMessage: string;
            patternMessage: string;
        };

        createPageTitle: string;
        editPageTitle: string;
    };
    sowSell: {
        importTitle: string;
        pigCount: {
            text: string;
            numericMessage: string;
            patternMessage: string;
        };
        pigHouse: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        pigName: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        averageAge: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        grade: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        specification: {
            text: string;
        };
        standardMeasureUnit: {
            text: string;
        };
        taxRate: {
            text: string;
        };
        unitPrice: {
            text: string;
            textone: string;
            emptyMessage: string;
            rangeMessage: string;
            patternMessage: string;
        };
        Amount: {
            text: string;
            requiredMessage: string;
            numericMessage: string;
            rangeMessage: string;
            patternMessage: string;
            emptyMessage: string;
        };
        Allamount: {
            text: string;
            noUnit: string;
        };
        unitDiscount: {
            text: string;
            numericMessage: string;
            rangeMessage: string;
            patternMessage: string;
        };
        pigTotalWeight: {
            text: string;
            noUnit: string;
            numericMessage: string;
            rangeMessage: string;
            patternMessage: string;
        };
        averageWeight: {
            text: string;
            noUnit: string;
        };
        unitPricePerKilogram: {
            text: string;
            noUnit: string;
            rangeMessage: string;
            patternMessage: string;
        };
        productName: {
            text: string;
            noProduct: string;
            waring: string;
        };
        pigSalesSlip: {
            text: string;
        };
        salesperson: {
            text: string;
            emptyMessage: string;
            placeholder: string;
        };
        pigType: {
            text: string;
            emptyMessage: string;
            placeholder: string;
        };
        ticketedPoint: {
            text: string;
            emptyMessage: string;
        };
        typeName: {
            text: string;
            emptyMessage: string;
        };
        customer: {
            text: string;
            emptyMessage: string;
            placeholder: string;
        };
        wareHouse: {
            text: string;
            emptyMessage: string;
            placeholder: string;
        };
        abstractName: {
            text: string;
            emptyMessage: string;
        };
        region: {
            text: string;
            emptyMessage: string;
            placeholder: string;
        };
        date: {
            text: string;
        };
        shippingAddress: {
            text: string;
        };
        varietiesName: {
            text: string;
            placeholder: string;
            requiredMessage: string;
        };
        dateOfSale: {
            text: string;
        };
        pigSales: {
            text: string;
        };
        auditStatus: {
            text: string;
            yes: string;
            no: string;
        };
        Customerarrears: {
            text: string;
        };
        Entrynumber: {
            text: string;
        };
        Salesorder: {
            text: string;
        };
        Salescontract: {
            text: string;
        };
        Salesslip: {
            text: string;
        };
        Discountsigning: {
            text: string;
        };
        Customercontact: {
            text: string;
        };
        Contactnumber: {
            text: string;
        };
        IsGive: {
            text: string;
            yes: string;
            no: string;
        };
        collection: {
            text: string;
        };
        receipt: {
            text: string;
        };
        moling: {
            text: string;
            limitMessage: string;
        };
        amountReceivablelimit: {
            text: string;
            patternMessage: string;
        };
        BasicAmount: {
            text: string;
        };
        NonStandardAmount: {
            text: string;
        };
        BatchName: {
            text: string;
        };
        createPageTitle: string;
        editPageTitle: string;
    };
    SowSellProject: {
        date: {
            text: string;
            emptyMessage: string;
        };
        projectname: {
            text: string;
            emptyMessage: string;
            message: string;
        };
        projectdescribe: {
            text: string;
            emptyMessage: string;
            message: string;
        };
        projecttype: {
            text: string;
            emptyMessage: string;
            placeholder: string;
        };
        begindate: {
            text: string;
            emptyMessage: string;
        };
        enddate: {
            text: string;
            emptyMessage: string;
        };
        productName: {
            text: string;
            noProduct: string;
            emptyMessage: string;
        };
        standardMeasureUnit: {
            text: string;
        };
        standardweightlowerlimit: {
            text: string;
            rangeMessage: string;
            patternMessage: string;
            emptyMessage: string;
        };
        standardweightlimit: {
            text: string;
            rangeMessage: string;
            patternMessage: string;
            emptyMessage: string;
        };
        unitPrice: {
            text: string;
            emptyMessage: string;
        };
        stepprice: {
            text: string;
            emptyMessage: string;
        };
        notstepprice: {
            text: string;
        };
        overweightUnitPrice: {
            text: string;
            rangeMessage: string;
            patternMessage: string;
            emptyMessage: string;
        };
        lossweightUnitPrice: {
            text: string;
            rangeMessage: string;
            patternMessage: string;
            emptyMessage: string;
        };
        auditStatus: {
            text: string;
            yes: string;
            no: string;
        };
        applicationCustomers: {
            text: string;
        };
        multiIntervalcomputation: {
            text: string;
        };
        singleIntervalcomputation: {
            text: string;
        };
        multiInterval: {
            text: string;
        };
        singleInterval: {
            text: string;
        };
        customerList: {
            text: string;
        };
        customerName: {
            text: string;
        };
        search: {
            text: string;
        };
        selectAll: {
            text: string;
        };
        revoke: {
            text: string;
        };
        previousPage: {
            text: string;
        };
        nextPage: {
            text: string;
        };
        apply: {
            text: string;
        };
        cancel: {
            text: string;
        };
        calculationRules: {
            text: string;
        };
        overweightRange: {
            text: string;
        };
        greaterthan: {
            text: string;
            patternMessage: string;
        };
        Lessthanorequalto: {
            text: string;
            patternMessage: string;
        };
        price: {
            text: string;
            rangeMessage: string;
            patternMessage: string;
        };
        weightlossInterval: {
            text: string;
        };
        examples: {
            text: string;
        };
        pricingStrategy: {
            text: string;
        };
        sucklingpigPricingtrategy: {
            text: string;
        };
        salesDetails: {
            text: string;
        };
        sucklingpigDetails: {
            text: string;
        };
        overweightintervalSetting: {
            text: string;
        };
        smallRange: {
            text: string;
        };
        bigRange: {
            text: string;
        };
        totalSales: {
            text: string;
        };
        saleAccount: {
            text: string;
        };
        clear: {
            text: string;
        };
        save: {
            text: string;
        };
        createPageTitle: string;
        editPageTitle: string;
    };
    reserveTurnSow: {
        title: string;
        dataDate: {
            text: string;
        };
        createPageTitle: string;
        editPageTitle: string;
        totalNumber: {
            text: string;
        };
        totalWeight: {
            text: string;
        };
        turnOutBatch: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        averageAge: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        earNumber: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
            placeholder: string;
        };
        turnOutPigHouseUnit: {
            text: string;
            emptyMessage: string;
            requiredMessage: string;
        };
        turnInBatch: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        turnInPigHouseUnit: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        pigTotalWeight: {
            text: string;
            requiredMessage: string;
            rangeMessage: string;
            patternMessage: string;
            emptyMessage: string;
        };
        sowdetails: {
            text: string;
        };
        turnInPigField: {
            text: string;
        };
    };
    ruttingRecord: {
        title: string;
        sameEarNumberMessage: string;
        dataDate: {
            text: string;
        };
        pigHouseUnitName: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        pigTotalWeight: {
            text: string;
            noUnit: string;
            numericMessage: string;
            rangeMessage: string;
            patternMessage: string;
        };
        dayAge: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        backfatThickness: {
            text: string;
            noUnit: string;
            rangeMessage: string;
            patternMessage: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        ruttingCount: {
            text: string;
            noUnit: string;
            rangeMessage: string;
            patternMessage: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        batch: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        personName: {
            text: string;
            requiredMessage: string;
        };
        earNumber: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
            placeholder: string;
        };
        pigHouseUnitId: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        sowdetails: {
            text: string;
        };
        createPageTitle: string;
        editPageTitle: string;
    };
    sowInfo: {
        total: string;
        content: {
            text: string;
        };
        unitParity: {
            text: string;
        };
        unitDay: {
            text: string;
        };
        type: {
            text: string;
        };
        VaccinesDrugs: {
            text: string;
        };
        consumption: {
            text: string;
        };
        routeOfAdministration: {
            text: string;
        };
        nestWeight: {
            text: string;
        };
        dateOfDelivery: {
            text: string;
        };
        expectedDateOfDelivery: {
            text: string;
        };
        parity: {
            text: string;
        };
        boarBreeds: {
            text: string;
        };
        abnormalDate: {
            text: string;
        };
        exceptionType: {
            text: string;
        };
        birthSituation: {
            text: string;
        };
        weaningLitterWeight: {
            text: string;
        };
        weaningNumber: {
            text: string;
        };
        weaningData: {
            text: string;
        };
        weaningSituation: {
            text: string;
        };
        mailOut: {
            text: string;
        };
        mailIn: {
            text: string;
        };
        fosterCare: {
            text: string;
        };
        mummy: {
            text: string;
        };
        stillbirth: {
            text: string;
        };
        malformation: {
            text: string;
        };
        weakOffspring: {
            text: string;
        };
        healthyBoy: {
            text: string;
        };
        liveBaby: {
            text: string;
        };
        data: {
            text: string;
        };
        noDataAvailable: {
            text: string;
        };
        weaningTimes: {
            text: string;
        };
        weaningPerLitter: {
            text: string;
        };
        averageWeightOfWeanedIndividuals: {
            text: string;
        };
        averageBirthWeight: {
            text: string;
        };
        totalLitterSizePerLitter: {
            text: string;
        };
        emptyTireTimes: {
            text: string;
        };
        matingTimes: {
            text: string;
        };
        matingState: {
            text: string;
        };
        matingData: {
            text: string;
        };
        gestationalPeriod: {
            text: string;
        };
        averageLitterSizeWeak: {
            text: string;
        };
        numberOfDeliveries: {
            text: string;
        };
        negativeTimesOfPregnancyTest: {
            text: string;
        };
        averageWeaningInterval: {
            text: string;
        };
        nonProductionDays: {
            text: string;
        };
        averageLitterSize: {
            text: string;
        };
        numberOfAbortions: {
            text: string;
        };
        timesOfReturningLove: {
            text: string;
        };
        averageLactationPeriod: {
            text: string;
        };
        productionDays: {
            text: string;
        };
        analysisInfo: {
            text: string;
        };
        remarks: {
            text: string;
            placeholder: string;
        };
        alreadyProducedParity: {
            text: string;
            requiredMessage: string;
            patternMessage: string;
        };
        weaningDays: {
            text: string;
            patternMessage: string;
        };
        birthDate: {
            text: string;
            placeholder: string;
        };
        leftNippleCount: {
            text: string;
            patternMessage: string;
        };
        rightNippleCount: {
            text: string;
            patternMessage: string;
        };
        birthUnitWeight: {
            text: string;
            patternMessage: string;
        };
        weaningUnitWeight: {
            text: string;
            patternMessage: string;
        };
        dateOfEntry: {
            text: string;
        };
        earDefect: {
            text: string;
            rangeMessage: string;
        };
        initInfo: {
            text: string;
        };
        emptyTire: {
            text: string;
        };
        abortion: {
            text: string;
        };
        returnToLove: {
            text: string;
        };
        weaning: {
            text: string;
        };
        lactation: {
            text: string;
        };
        pregnancy: {
            text: string;
        };
        negativePregnancyTest: {
            text: string;
        };
        callOut: {
            text: string;
        };
        day: {
            text: string;
        };
        transferOut: {
            text: string;
        };
        callIn: {
            text: string;
        };
        transferIn: {
            text: string;
        };
        position: {
            text: string;
        };
        state: {
            text: string;
        };
        dayAge: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        birthPlace: {
            text: string;
        };
        strainVarieties: {
            text: string;
        };
        baseInfo: {
            text: string;
        };
        productionRecord: {
            text: string;
        };
        healthRecord: {
            text: string;
        };
        fileCard: {
            text: string;
        };
        weeklyDistribution: {
            text: string;
        };
        reserve: {
            text: string;
        };
        temperaturechange: {
            text: string;
        };
        Intakechange: {
            text: string;
        };
        dailyfeedintake: {
            text: string;
        };
        dailydrinkingwater: {
            text: string;
        };
    };

    sowAllocation: {
        title: string;
        dataDate: {
            text: string;
            emptyMessage: string;
        };
        personId: {
            text: string;
        };
        pigFarmName: {
            text: string;
        };
        o;
        inPigHouseUnitName: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        pigHouseUnitName: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        pigFieId: {
            text: string;
        };
        inpigFieId: {
            text: string;
        };
        inPigFarmName: {
            text: string;
            choosePigFarmMessage: string;
            emptyMessage: string;
            placeholder: string;
        };
        personName: {
            text: string;
            emptyMessage: string;
        };

        createPageTitle: string;
        editPageTitle: string;
        notbenchang: string;
    };
    semenAllocation: {
        title: string;
        dataDate: {
            listText: string;
            text: string;
            emptyMessage: string;
        };
        abstractCategory: {
            text: string;
            emptyMessage: string;
        };
        inWarehouse: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        outWarehouse: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        personId: {
            text: string;
        };
        pigFarmName: {
            text: string;
        };
        inBatchName: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        batchName: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        quantity: {
            text: string;
            requiredMessage: string;
            rangeMessage: string;
        };
        inpigFieId: {
            text: string;
        };
        stockCount: {
            text: string;
        };
        inPigFarmName: {
            text: string;
            choosePigFarmMessage: string;
            emptyMessage: string;
            placeholder: string;
        };
        personName: {
            text: string;
            emptyMessage: string;
        };
        productName: {
            text: string;
            placeholder: string;
            requiredMessage: string;
        };
        specification: {
            text: string;
        };
        measureUnit: {
            text: string;
        };

        createPageTitle: string;
        editPageTitle: string;
        notbenchang: string;
    };
    semenAdjustment: {
        title: string;
        dataDate: {
            text: string;
            emptyMessage: string;
        };
        abstract: {
            text: string;
            emptyMessage: string;
        };
        warehouse: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        adjustmentPerson: {
            text: string;
        };
        productName: {
            text: string;
            placeholder: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        specification: {
            text: string;
        };
        measureUnit: {
            text: string;
        };
        semenBatchName: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        quantity: {
            text: string;
            rangeMessage: string;
            patternMessage: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        amount: {
            text: string;
            rangeMessage: string;
            patternMessage: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        amountOrQuantityempty: string;
        createPageTitle: string;
        editPageTitle: string;
    };
    sowBatchSetting: {
        title: string;
        relationSowTitle: string;
        status: {
            text: string;
        };
        pigHouseUnitName: {
            text: string;
        };
        relationNumber: {
            text: string;
            success: string;
        };
        finish: {
            trueText: string;
            falseText: string;
        };
        pigField: {
            text: string;
        };
        dataDate: {
            text: string;
        };
        relation: {
            text: string;
        };

        days: {
            text: string;
        };

        page: {
            text: string;
            footer: string;
        };

        beginDate: {
            text: string;
            placeholder: string;
            requiredMessage: string;
        };
        endDate: {
            text: string;
            placeholder: string;
            requiredMessage: string;
        };
        finishDate: {
            text: string;
        };
        isFinish: {
            text: string;
            trueText: string;
            falseText: string;
        };

        batchForm: {
            text: string;
        };
        batch: {
            name: string;
            retreatBegin: string;
            selectBegin: string;
            retreatEnd: string;
            selectEnd: string;
            end: string;
            rangeMessage: string;
            requiredMessage: string;
        };
        IsItOver: {
            text: string;
        };
        remarks: {
            text: string;
            placeholder: string;
        };
        basicInformation: {
            text: string;
        };

        createPageTitle: string;
        editPageTitle: string;
    };
    sowBirth: {
        title: string;
        dataDate: {
            text: string;
        };
        days: {
            text: string;
        };
        pigTotalWeight: {
            text: string;
            rangeMessage: string;
            patternMessage: string;
        };
        healthCount: {
            text: string;
            rangeMessage: string;
        };
        weakCount: {
            text: string;
            rangeMessage: string;
        };
        deformityCount: {
            text: string;
            rangeMessage: string;
        };
        stillBirthCount: {
            text: string;
            rangeMessage: string;
        };
        mummyCount: {
            text: string;
            rangeMessage: string;
        };
        livingCount: {
            text: string;
            headerHelpMessage: string;
        };
        nestTotalWeight: {
            text: string;
            rangeMessage: string;
            patternMessage: string;
        };
        nestNumber: {
            text: string;
            requireMessage: string;
        };
        easyToLitter: {
            text: string;
            requireMessage: string;
        };
        personName: {
            text: string;
            requiredMessage: string;
        };
        deleteConfirm: {
            confirm: string;
        };
        ProgenydeleteConfirm: {
            confirm: string;
        };
        createPageTitle: string;
        editPageTitle: string;
    };
    sowProgeny: {
        tip: string;
        title: string;
        hbEarNumber: string;
        earNumber: {
            text: string;
            requireMessage: string;
        };
        birthTimes: {
            text: string;
        };
        nestNumber: {
            text: string;
            requireMessage: string;
        };
        weight: {
            text: string;
            rangeMessage: string;
            patternMessage: string;
        };
        leftNipple: {
            text: string;
        };
        rightNipple: {
            text: string;
        };
        boarVarieties: {
            text: string;
        };
        sowVarieties: {
            text: string;
        };
        createPageTitle: string;
        editPageTitle: string;
    };
    sowBirthPlan: {
        title: string;
        sowDelivery: {
            text: string;
        };
        dataDate: {
            text: string;
        };
        estimatedDate: {
            text: string;
        };
        lastDate: {
            text: string;
        };
        days: {
            text: string;
        };
        personName: {
            text: string;
            requiredMessage: string;
        };
        pigHouseUnitName: {
            text: string;
        };
        deliveryDate: {
            text: string;
        };
        createPageTitle: string;
        editPageTitle: string;
    };
    sowDeath: {
        title: string;
        sowDeath: string;
        dataDate: {
            text: string;
        };
        lastState: {
            text: string;
        };
        lastDate: {
            text: string;
        };
        deathTypeId: {
            text: string;
            requiredMessage: string;
            items: {
                death: string;
                other: string;
            };
            emptyMessage: string;
        };
        deathReasonId: {
            text: string;
            requiredMessage: string;
            emptyMesage: string;
        };
        createPageTitle: string;
        editPageTitle: string;
    };
    sowFile: {
        local: string;
        pedigreeImport: string;
        title: string;
        parity: {
            text: string;
        };
        alreadyProducedParity: {
            text: string;
            requiredMessage: string;
            patternMessage: string;
        };
        dataDate: {
            text: string;
        };
        productName: {
            text: string;
            placeholder: string;
            requiredMessage: string;
            goodsText: string;
            goodsplaceholder: string;
            goodsAdd: string;
        };
        earNumberShortage: {
            text: string;
        };
        earDefect: {
            text: string;
            rangeMessage: string;
        };
        inState: {
            text: string;
        };
        birthDate: {
            text: string;
            placeholder: string;
            requiredMessage: string;
        };
        baseInfoTitle: {
            text: string;
        };
        strainName: {
            text: string;
            placeholder: string;
            requiredMessage: string;
            requiredSelect: string;
        };
        birthInfoTitle: {
            text: string;
        };

        varietiesName: {
            text: string;
            placeholder: string;
            requiredMessage: string;
            requiredSelect: string;
        };

        earTag: {
            text: string;
            placeholder: string;
        };
        dateOfEntry: {
            text: string;
        };
        birthPlace: {
            text: string;
        };
        birthUnitWeight: {
            text: string;
            patternMessage: string;
        };
        weaningDays: {
            text: string;
            patternMessage: string;
        };
        leftNippleCount: {
            text: string;
            patternMessage: string;
        };
        rightNippleCount: {
            text: string;
            patternMessage: string;
        };
        weaningUnitWeight: {
            text: string;
            patternMessage: string;
        };
        remarks: {
            text: string;
            placeholder: string;
        };
        pedigreeInfoTitle: {
            text: String;
        };
        father: {
            text: string;
        };
        mother: {
            text: string;
        };
        notAllow: {
            text: string;
        };
        Batch: {
            text: string;
        };
        printFile: {
            confirm: string;
            confirmTwo: string;
            ageOfDay: string;
            printer: string;
            printDate: string;
            parity: string;
            breeder: string;
            breedingSituation: string;
            litterSize: string;
            fosterCare: string;
            weaning: string;
            dateOfMating: string;
            breedingMethod: string;
            boarOrCommodity: string;
            abnormalDate: string;
            exceptionType: string;
            preProductionDate: string;
            deliveryDate: string;
            jianzai: string;
            weakBoy: string;
            malformation: string;
            stillbirth: string;
            mummy: string;
            totalLitterSize: string;
            mail: string;
            mailIn: string;
            weaningDate: string;
            weaningNumber: string;
            litterWeightAtWeaning: string;
            sowFilePrinting: string;
            sowQRCodePrinting: string;
        };
        createPageTitle: string;
        twoCodePrinting: string;
        fileCardPrinting: string;
        editPageTitle: string;
        birthTip: string;
        tip: string;
        importXiPu: string;
    };
    sowFosterCare: {
        title: string;

        pigCount: {
            text: string;
            requiredMessage: string;
            rangeMessage: string;
        };
        fosterEarNumber: {
            text: string;
            requiredMessage: string;
            chooseLimitMessage: string;
        };
        description: {
            text: string;
        };
        sowfosterRecord: {
            text: string;
        };

        breedingDate: {
            text: string;
            requiredMessage: string;
        };
        boarEarNumber: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        dataDate: {
            text: string;
        };
        pregnancyDate: {
            text: string;
        };
        pregnancyResult: {
            text: string;
            requiredMessage: string;
        };
        childBirthButton: {
            data: string;
        };
        healthCount: {
            text: string;
            rangeMessage: string;
            rangeMessage1: string;
        };
        healthTotalWeight: {
            text: string;
            rangeMessage: string;
            rangeMessage1: string;
        };
        weakCount: {
            text: string;
            rangeMessage: string;
            rangeMessage1: string;
        };
        deformityCount: {
            text: string;
            rangeMessage: string;
            rangeMessage1: string;
        };
        stillBirthCount: {
            text: string;
            rangeMessage: string;
            rangeMessage1: string;
        };
        mummyCount: {
            text: string;
            rangeMessage: string;
            rangeMessage1: string;
        };
        parity: {
            text: string;
            rangeMessage: string;
            rangeMessage1: string;
        };
        weaningCount: {
            text: string;

            rangeMessage: string;
        };
        weaningTotalWeight: {
            text: string;
            rangeMessage: string;
            rangeMessage1: string;
        };
        weaningTotaldata: {
            text: string;
        };
        fosterCare: {
            text: string;
            requiredMessage: string;
        };
        createPageTitle: string;
        editPageTitle: string;
    };
    sowHistory: {
        title: string;
        pregnancyResult: {
            text: string;
        };
        healthCount: {
            text: string;
            rangeMessage: string;
            rangeMessage1: string;
        };
        healthTotalWeight: {
            text: string;
            rangeMessage: string;
            rangeMessage1: string;
        };
        weakCount: {
            text: string;
            rangeMessage: string;
            rangeMessage1: string;
        };
        deformityCount: {
            text: string;
            rangeMessage: string;
            rangeMessage1: string;
        };
        stillBirthCount: {
            text: string;
            rangeMessage: string;
            rangeMessage1: string;
        };
        mummyCount: {
            text: string;
            rangeMessage: string;
            rangeMessage1: string;
        };
        weaningCount: {
            text: string;
            rangeMessage: string;
        };
        weaningData: {
            text: string;
        };
        weaningTotalWeight: {
            text: string;
            rangeMessage: string;
            rangeMessage1: string;
        };
        breedingDate: {
            text: string;
            requiredMessage: string;
        };
        parity: {
            text: string;
            rangeMessage: string;
            rangeMessage1: string;
        };
        boarEarNumber: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
            rangeMessage: string;
        };
        dataDate: {
            text: string;
        };
        childBirthButton: {
            data: string;
        };
        createPageTitle: string;
        editPageTitle: string;
    };
    sowBreedingplan: {
        totalNumber: {
            text: string;
        };
        totalWeight: {
            text: string;
        };
        pigHouseUnitName: {
            text: string;
        };
        lastEvent: {
            text: string;
        };
        daysOpen: {
            text: string;
        };
        animalBreeder: {
            text: string;
        };
        dataDate: {
            text: string;
        };
        warning: {
            text: string;
        };
        breedingPlan: {
            text: string;
        };
        pushOrNot: {
            text: string;
            yes: string;
            no: string;
        };
        taskStatus: {
            text: string;
        };
        createPageTitle: string;
        editPageTitle: string;
    };
    breedingModelSet: {
        createPageTitle: string;
        editPageTitle: string;
        title: string;
        modelName: {
            text: string;
            capacity_range: string;
            rangeMessage: string;
        };
        modelType: {
            text: string;
            rangeMessage: string;
        };
        GrowthTraits: {
            text: string;
            capacity_range: string;
            rangeMessage: string;
        };
        ReproductiveTraits: {
            text: string;
            capacity_range: string;
            rangeMessage: string;
        };
        IsUse: {
            text: string;
            rangeMessage: string;
        };
        Sort: {
            rangeMessage: string;
            capacity_range: string;
            text: string;
        };
        Remark: {
            rangeMessage: string;
            capacity_range: string;
            text: string;
        };
    };
    sowTurn: {
        sowTransfer: {
            text: string;
        };
        sowTransferRecord: {
            text: string;
        };
        dataDate: {
            text: string;
        };
        createPageTitle: string;
        editPageTitle: string;
    };
    sowWeaning: {
        daysOfLactation: {
            text: string;
        };
        weaningCount: {
            text: string;
            noUnit: string;
            rangeMessage: string;
            rangeMessage1: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        totalWeaningLitterWeight: {
            text: string;
            rangeMessage: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        weaningRecords: {
            text: string;
        };
        sowWeight: {
            emptyMessage: string;
        };
        weaning: {
            text: string;
            emptyMessage: string;
        };
        weaningTotaldata: {
            text: string;
        };
        createPageTitle: string;
        editPageTitle: string;
    };
    sowWeaningPlan: {
        totalNumber: {
            text: string;
        };
        totalWeight: {
            text: string;
        };
        deliveryDate: {
            text: string;
        };
        daysOfLactation: {
            text: string;
        };
        dataDate: {
            text: string;
            requiredMessage: string;
        };
        weaningProgram: {
            text: string;
        };
        pushOrNot: {
            text: string;
            yes: string;
            no: string;
        };
        taskStatus: {
            text: string;
        };
        createPageTitle: string;
        editPageTitle: string;
    };

    reviewComponent: {
        batchReview: {
            allReviewedTip: string;
            allNotReviewedTip: string;
            successTip: string;
            success: string;
            allReviewed: string;
            allCancel: string;
            confirmText: string;
            cancelText: string;
            noPermission: string;
            notReview: string;
        };
    };
    importExcelTemplats: {
        layEggsIndex: {
            title: string;
            fileName: string;
        };
        egggoodssalesorder: {
            title: string;
            fileName: string;
        };
        chickenreceive: {
            title: string;
            fileName: string;
        };
        materialreceive: {
            title: string;
            fileName: string;
        };
        yhcashdeposit: {
            title: string;
            fileName: string;
        };
        yhpatrolrecord: {
            title: string;
            fileName: string;
        };
        drugotherreceive: {
            title: string;
            fileName: string;
        };
        yhouthouserecycle: {
            title: string;
            fileName: string;
        };
        yhchickenfarm: {
            title: string;
            fileName: string;
        };
        yhfarmerinfomation: {
            title: string;
            fileName: string;
        };
        yhfarmercontract: {
            title: string;
            fileName: string;
        };
        yhbatch: {
            title: string;
            fileName: string;
        };
        yhpriceproposals: {
            title: string;
            fileName: string;
        };
        zqbreedstandard: {
            title: string;
            fileName: string;
        };
        yhpoultrysales: {
            title: string;
            fileName: string;
        };
    };
    boarInfo: {
        earNumber: string;
        position: string;
        state: string;
        birthDays: string;
        day: string;
        birthPlace: string;
        strainVarieties: string;
        baseInfo: string;
        semenRecord: string;
        breedingRecord: string;
        productionRecord: string;
        healthRecord: string;
        initInfo: string;
        earNumberShortage: string;
        birthDate: string;
        inState: string;
        inDate: string;
        birthWeight: string;
        leftNipple: string;
        rightNipple: string;
        analysisInfo: string;
        semenCount: string;
        dilutedCopiesCount: string;
        sowBreedingCount: string;
        breedingSowDelivery: string;
        breedingSowAbnormal: string;
        avgWeekSemen: string;
        avgSemenQuantity: string;
        avgdilutedCopies: string;
        avgSpermDensity: string;
        avgSpermVitality: string;
        sumFarrowing: string;
        sumAlive: string;
        sumEffective: string;
        sumiHeath: string;
        sumiWeak: string;
        avgFat: string;
        avgAlive: string;
        avgEffective: string;
        avGiHeath: string;
        avGiWeak: string;
        fiveSemen: string;
        interval: string;
        avgSemenquantity: string;
        avgdensity: string;
        meanactivity: string;
        avgdeformity: string;
        date: string;
        semenQuantity: string;
        semenColor: string;
        semenSmell: string;
        spermVitality: string;
        spermDensity: string;
        deformityRate: string;
        dilutedCopies: string;
        breeding: string;
        breedingDate: string;
        sowPigEarNumber: string;
        sowVarieties: string;
        pregnancyDate: string;
        pregnancyResult: string;
        pregnancyInterval: string;
        predate: string;
        childbirth: string;
        farrowingDate: string;
        pregnancyDay: string;
        healthCount: string;
        weakCount: string;
        deformityCount: string;
        stillbirthCount: string;
        mummyCount: string;
        pigCount: string;
        nestTotalWeight: string;
        event: string;
        content: string;
        numericalOrder: string;
        type: string;
        product: string;
        dose: string;
        wayName: string;
        remarks: string;
        noData: string;
    };
    inventoryIndex: {
        allCount: string;
        numText: string;
        sowCount: string;
        boarCount: string;
        fatCount: string;
        category: string;
        ruzhu: string;
        baoyu: string;
        yufei: string;
        houbeizhu: string;
        houbeigongzhu: string;
        houbeimuzhu: string;
        countText: string;
        percent: string;
        knockout: string;
        feed: string;
        other: string;
        empty: string;
        pregency: string;
        info: string;
        boarInfo: string;
        fatInfo: string;
    };

    produceIndex: {
        tabMonth: string;
        tabCom: string;
        tabPig: string;
        year: string;
        placeholder: string;
        searchText: string;
        refresh: string;
        more: string;
        index: string;
        month: string;
        total: string;
        basicSow: string;
        count: string;
        basicCount: string;
        basicDeathTitle: string;
        basicDeath: string;
        basicKnock: string;
        basicKnockTitle: string;
        breedCount: string;
        breed: string;
        weanTitle: string;
        weanDays: string;
        weanWeekTitle: string;
        weanWeek: string;
        birthTitle: string;
        birth: string;
        birthRatio: string;
        birthHouseTitle: string;
        birthHouse: string;
        healthTitle: string;
        healthCount: string;
        liveTitle: string;
        liveCount: string;
        houseAverageTitle: string;
        houseAverage: string;
        houseWeanTitle: string;
        houseWean: string;
        mummyTitle: string;
        mummyName: string;
        hbTitle: string;
        productPig: string;
        hbLiving: string;
        weanRatioTitle: string;
        houseLivingTitle: string;
        houseLiveRatio: string;
        baoyuTitle: string;
        baoyu: string;
        hbBoar: string;
        hbBoarRatio: string;
        hbSowTitle: string;
        hbSowRatio: string;
        yfTitle: string;
        yfRatio: string;
        rsTitle: string;
        rsName: string;
        rsDay: string;
        brTitle: string;
        brName: string;
        brDay: string;
        npdTitle: string;
        produceName: string;
        npd: string;
        lsyTitle: string;
        lsy: string;
        psyTitle: string;
        psy: string;
        time: string;
        week: string;
        period: string;
        SowPig: string;
        SowDead: string;
        SowEliminate: string;
        BreedCount: string;
        DNFQ: string;
        TBreed: string;
        sumPig: string;
        WCountAVG: string;
        hbRatio: string;
        DNRatio: string;
        CFRatio: string;
        BYRatio: string;
        BoarRatio: string;
        SowRatio: string;
        YFRatio: string;
        RSSpan: string;
        PRSpan: string;
        NPD: string;
        To: string;
        SowBreedDetial: string;
        WeaningIntervalDetails: string;
        WeaningSevenDaysDetial: string;
    };
    produceSummary: {
        month: string;
        week: string;
        day: string;
        time: string;
        HB: string;
        CG: string;
        DBI: string;
        SW: string;
        TT: string;
        XS: string;
        DBO: string;
        QT: string;
        CZ: string;
        PDI: string;
        PDO: string;
        HSI: string;
        HBI: string;
        HBO: string;
        CM: string;
        RJYX: string;
        KT: string;
        LC: string;
        HBS: string;
        DN: string;
        FQ: string;
        HJ: string;
        JZ: string;
        RZ: string;
        ST: string;
        JX: string;
        mummy: string;
        unit: string;
        dyjz: string;
        dyrz: string;
        zdn: string;
        loss: string;
        dycz: string;
        number: string;
        pz: string;
        yc: string;
        fm: string;
        dnmx: string;
        summary: string;
        table: string;
        period: string;
        search: string;
        refresh: string;
        more: string;
        sow: string;
        initial: string;
        finish: string;
        product: string;
        pztj: string;
        yctj: string;
        fmtj: string;
        house: string;
        live: string;
        effect: string;
        dntj: string;
        weight: string;
        averageWeight: string;
        breed: string;
        hbBreed: string;
        dnBreed: string;
        fqBreed: string;
        rjyxBreed: string;
        ktBreed: string;
        lcBreed: string;
        qtBreed: string;
        hjBreed: string;
        abnormal: string;
        hj: string;
        birth: string;
        allLive: string;
        allEffect: string;
        dn: string;
        dnzz: string;
        boar: string;
        zrhj: string;
        zchj: string;
        qtzc: string;
        sowCount: string;
        fat: string;
        fatIn: string;
        fatOut: string;
        baoyu: string;
        byI: string;
        byO: string;
        yf: string;
        yfI: string;
        yfO: string;
        hb: string;
        hbBoar: string;
        hbSow: string;
        qtswzc: string;
    };
    pregnancyAnalysis: {
        week1: string;
        week2: string;
        week3: string;
        week4: string;
        week5: string;
        week6: string;
        PHYCSGZ: string;
        RSSGZ: string;
        week: string;
        dateRange: string;
        breedDateRange: string;
        breedQuantity: string;
        hbCount: string;
        preDeliveryRange: string;
        PHZS: string;
        exectionCount: string;
        deliveryCount: string;
        stRatio: string;
        deliveryRatio: string;
        totalPigCount: string;
        totalLivePigCount: string;
        totalHealthPigCount: string;
        liveRatio: string;
        wAvgPigCount: string;
        wAvgLivePigCount: string;
        wAvgHealthPigCount: string;
        T: string;
        PZJGMXB: string;
        PHGZ: string;
        PHKB: string;
        refresh: string;
        xianshi: string;
        yincang: string;
        search: string;
        FXFS: string;
        GZFS: string;
        PZRQ: string;
        tip: string;
    };
    produceTrend: {
        index: string;
        search: string;
        refresh: string;
        more: string;
        year: string;
        month: string;
        day: string;
        unit: string;
        npd: string;
        psy: string;
        sow: string;
        sowDeath: string;
        sowKnock: string;
        sowBreed: string;
        sowWean: string;
        sowBreedBirth: string;
        sowBirth: string;
        wean: string;
        hb: string;
        weanLive: string;
        cfDeath: string;
        byDeath: string;
        hbBoar: string;
        hbSow: string;
        yfDeath: string;
        rs: string;
        br: string;
        produce: string;
        weanTitle: string;
        weanName: string;
        rsTitle: string;
        rsName: string;
        brTitle: string;
        brName: string;
        npdTitle: string;
        npdName: string;
        lsyTitle: string;
        lsyName: string;
        psyTitle: string;
        psyName: string;
    };
    indexPage: {
        houseSet: string;
        noHouse: string;
        link: string;
        guideCom: string;
        guideFarm: string;
        watchPlat: string;
        all: string;
        develop: string;
        wean: string;
        breed: string;
        birth: string;
        saveErr: string;
        common: string;
        jx: string;
        cb: string;
        wz: string;
        cw: string;
        fy: string;
        dpz: string;
        dpt: string;
        qpz: string;
        scrj: string;
        scrjt: string;
        qrj: string;
        srj: string;
        srjt: string;
        fm: string;
        qfm: string;
        fmt: string;
        bed: string;
        bedt: string;
        qbed: string;
        dWean: string;
        weant: string;
        qwean: string;
        weanWarn: string;
        breedWarn: string;
        birthWarn: string;
        qBirth: string;
        tip: string;
        warn: string;
        house: string;
        houseTip: string;
        count: string;
        boarCount: string;
        sowCount: string;
        fatCount: string;
        outRatio: string;
        boarDeathRate: string;
        sowFarrowingRate: string;
        finishRate: string;
        deliveryRate: string;
        khRate: string;
        deliveryFinishRate: string;
        weaningRate: string;
        byRate: string;
        byDeathRate: string;
        yfRate: string;
        yfDeathRate: string;
        divideOutRate: string;
        deliveryHouseDeathRate: string;
        hbRate: string;
        recommend: string;
        produce: string;
        ad1: string;
        cost: string;
        ad2: string;
        health: string;
        ad3: string;
        setting: string;
        cancel: string;
        save: string;
        app: string;
        intelligent: string;
        materialmanagement: string;
        purchase: string;
        yuan: string;
        purchasethismonth: string;
        accumulatedpurchaseinthisyear: string;
        pigsinstorage: string;
        materialstorage: string;
        sale: string;
        salesthismonth: string;
        accumulatedsalesinthisyear: string;
        pigsales: string;
        stock: string;
        currentinventory: string;
        materialrequisition: string;
        inventorychecking: string;
        inventoryadjustment: string;
        other: string;
        management: string;
        buy: string;
        boargengxinvl: string;
        peizhuilv: string;
        sowsitaolv: string;
        shipeilv: string;
        yugufenmianlv: string;
        shangshilv: string;

        yufeisiwanglv: string;
        houbeimuzhuliyonglv: string;
        houpeizhusiwanglv: string;

        pigfarmindex: string;
        lastmonth: string;
        currentmonth: string;
        more: string;
        psy: string;
        SowEliminateRatio: string;
        SowDeadRatio: string;
        TBreedRatioData: string;
        nestAvg: string;
        DNRatio: string;
        zhuzhicaigou: string;
        zhuzhixiaoshou: string;
        produceindex: string;
        wuzicaigou: string;
        currentyear: string;
        yearcaigou: string;
        monthcaigou: string;
        wuzikucun: string;
        siliao: string;
        shouyao: string;
        yimiao: string;
        wuzipandian: string;
        wuzilingyong: string;
        nxinjicai: string;
        huodongjia: string;
        pighousecount: string;
        dEliminate: string;
        eliminatePrompt: string;
        qEliminate: string;
    };
    houseUnit: {
        infoText: string;
        watch: string;
        watchPlat: string;
        boar: string;
        sow: string;
        fat: string;
        EarNumber: string;
        BatchName: string;
        VarietiesName: string;
        ProductName: string;
        AlreadyProducedParity: string;
        PigState: string;
        Days: string;
        BatchForm: string;
        BatchTypeName: string;
        io: string;
        fio: string;
        boarDeathN: string;
        nodata: string;
        boarTTN: string;
        boarTurnN: string;
        boarCJN: string;
        boarWYN: string;
        boarDBN: string;
        sowFQN: string;
        sowRJN: string;
        sowDBN: string;
        sowWYN: string;
        sowTTN: string;
        sowSWN: string;
        myN: string;
        sowPZN: string;
        bbN: string;
        sowTurnN: string;
        sowDNN: string;
        sowFMN: string;
        fatWYN: string;
        fatPDN: string;
        fatSWN: string;
        fatTurnN: string;
        sellN: string;
        HB: string;
        KH: string;
        FQ: string;
        LC: string;
        KT: string;
        RS: string;
        BR: string;
        DN: string;
        TT: string;
        SW: string;
        QT: string;
        sell: string;
        DBZR: string;
        advance: string;
        refresh: string;
        list: string;
        table: string;

        boarDeath: string;

        boarTT: string;
        boarTurn: string;
        boarCJ: string;
        boarWY: string;
        boarDB: string;
        sowFQ: string;
        sowRJ: string;
        sowDB: string;
        sowWY: string;
        sowTT: string;
        sowSW: string;
        my: string;
        sowPZ: string;
        bb: string;
        sowTurn: string;
        sowDN: string;
        sowFM: string;
        fatWY: string;
        fatPD: string;
        fatSW: string;
        fatTurn: string;
        XS: string;
        sort: string;
        all: string;
        up: string;
        down: string;
        operation: string;
        del: string;
        count: string;
        col: string;
        day: string;
        index: string;
        electric: string;
        product: string;
        begin: string;
        end: string;
        batchend: string;
        create: string;
        delete: string;
        age: string;
        monthage: string;
        newday: string;
        num: string;
        avgage: string;
        quantity: string;
        dayage: string;
        temperature: string;
        temperatureTimestamp: string;
        backFatIndex: string;
        backFatDate: string;
        feedingquantity: string;
        temperatureno: string;
        fatcondition: string;
        FeedIntake: string;
        oestrus: string;
        backFat: string;
        pigmanage: string;
    };
    guide: {
        first: string;
        departmentTitle: string;
        departmentDes: string;

        productTitle: string;
        productDes: string;

        entTitle: string;
        entDes: string;

        warehouseTitle: string;
        warehouseDes: string;

        providerTitle: string;
        providerDes: string;

        second: string;
        staffTitle: string;
        staffDes: string;

        personTitle: string;
        personDes: string;

        authTitle: string;
        authDes: string;

        farmTitle: string;
        farmDes: string;

        third: string;
        farmSet: string;
        farmSetDes: string;

        pighouseTitle: string;
        pighouseDes: string;

        boarTitle: string;
        boarDes: string;

        sowTitle: string;
        sowDes: string;

        fatTitle: string;
        fatDes: string;

        boarInitialTitle: string;
        boarInitialDes: string;

        sowInitialTitle: string;
        sowInitialDes: string;

        fatInitialTitle: string;
        fatInitialDes: string;
        historyTitle: string;
        historyDes: string;
        departMenu: string;
        productMenu: string;
        entMenu: string;
        warehouseMenu: string;
        providerMenu: string;
        staffMenu: string;
        personMenu: string;
        authMenu: string;
        farmMenu: string;
        farmsetMenu: string;
        pighouseMenu: string;
        boarMenu: string;
        sowMenu: string;
        fatMenu: string;
        boarinitialMenu: string;
        sowinitialMenu: string;
        fatinitialMenu: string;
        history: string;
    };
    prompt: {
        unit: string;
        PrepareBreed: string;
        BedPrompt: string;
        Delivery: string;
        WeaningPrompt: string;
        FirstCheck: string;
        SecondCheck: string;
        warn: string;
        day: string;
        noWean: string;
        noBreed: string;
        noBirth: string;
        noData: string;
        infoText: string;
        all: string;
        clear: string;
        state: string;
        num: string;
        col: string;
        ear: string;
    };
    enums: {
        importField: {
            dataDateText: string;
            personIDText: string;
            pigTypeText: string;
            pigFarmIDText: string;
            warehouseIdText: string;
            godownManText: string;
            recipientText: string;
            requisitionUnitTypeText: string;
            requisitionTypeText: string;
            feedTypeText: string;
            purchaseTypeText: string;
            purchaseAbstractText: string;
            ticketedPointIdText: string;
            supplierIdText: string;
            salesTypeText: string;
            salesAbstractText: string;
            customerIdText: string;
            marketIdText: string;
            shippingAddressText: string;
            productIdText: string;
            customerContactText: string;
            contactNumberText: string;
            TestTypeText: string;
            IsHbText: string;
        };
    };
    invalidPage: {
        tip: string;
        button: string;
    };
    litterweightmeasure: {
        title: string;
        dataDate: {
            text: string;
        };
        pigHouseUnitName: {
            text: string;
        };
        SowPigEarNumber: {
            text: string;
        };
        PigField: {
            text: string;
        };
        PigCount: {
            text: string;
            requiredMessage: string;
        };
        PigTotalWeight: {
            text: string;
            requiredMessage: string;
        };
        PersonName: {
            text: string;
        };
        weight: {
            text: string;
            noUnit: string;
            rangeMessage: string;
            patternMessage: string;
            requiredMessage: string;
        };
        createPageTitle: string;
        editPageTitle: string;
    };
    weaningweight: {
        title: string;
        dataDate: {
            text: string;
        };
        BatchId: {
            text: string;
        };
        PigId: {
            text: string;
        };
        Code: {
            text: string;
        };
        pigHouseUnitName: {
            text: string;
        };
        PigField: {
            text: string;
        };
        PigTotalWeight: {
            text: string;
        };
        SowPigEarNumber: {
            text: string;
        };
        PersonName: {
            text: string;
        };
        weight: {
            text: string;
            noUnit: string;
            rangeMessage: string;
            patternMessage: string;
            requiredMessage: string;
        };
        createPageTitle: string;
        editPageTitle: string;
    };
    growthperformance: {
        title: string;
        dataDate: {
            text: string;
        };
        BatchId: {
            text: string;
        };
        PigEarNumber: {
            text: string;
        };
        Code: {
            text: string;
        };
        pigHouseUnitName: {
            text: string;
            requiredMessage: string;
        };
        PigField: {
            text: string;
        };
        PigWeight: {
            text: string;
        };
        MaterialsUsed: {
            text: string;
        };
        BackfatThickness1: {
            text: string;
        };
        BackfatThickness2: {
            text: string;
        };
        BackfatThickness3: {
            text: string;
        };
        OcularMuscleArea: {
            text: string;
        };
        OcularMuscleThickness: {
            text: string;
        };
        IntermuscularFat: {
            text: string;
        };
        CodName: {
            text: string;
            requiredMessage: string;
        };
        PersonName: {
            text: string;
        };
        TestType: {
            text: string;
            requiredMessage: string;
        };
        weight: {
            text: string;
            noUnit: string;
            rangeMessage: string;
            patternMessage: string;
            requiredMessage: string;
        };
        createPageTitle: string;
        editPageTitle: string;
    };
    feedingType: {
        EarNumber: string;
        PigHouseType: string;
        PigHouse: string;
        BatchNumber: string;
        sowBatchNumber: string;
        boarBatchNumber: string;
        PigFarm: string;
    };
    entranceState: {
        Leave: string;
        Enter: string;
        Wait: string;
    };
    status: {
        finishStatus: {
            incomplete: string;
            completed: string;
        };
        pigStatus: {
            hb: string;
            kh: string;
            fq: string;
            lc: string;
            kt: string;
            rs: string;
            br: string;
            dn: string;
            tt: string;
            sw: string;
            qt: string;
            xs: string;
            dbzr: string;
        };
        sowPregnancyStatus: {
            lc: string;
            kt: string;
            fq: string;
            kh: string;
            rjyx: string;
        };
        batchType: {
            rz: string;
            by: string;
            yf: string;
            hbz: string;
            hbgz: string;
            hbmz: string;
        };
    };
    pigType: {
        gz: string;
        mz: string;
        fz: string;
    };
    breedingMatch: {
        title: string;
        index: string;
        dataDate: {
            text: string;
            requiredMessage: string;
        };
        PigEarNumber: {
            text: string;
        };
        BoarEarNumber: {
            text: string;
        };
        BreedingCount: {
            text: string;
        };
        FarrowCount: {
            text: string;
        };
        PregnancyCount: {
            text: string;
        };
        PigState: {
            text: string;
        };
        PigStateDate: {
            text: string;
        };
        MatchedBoar: {
            text: string;
        };
        SowKinshipID: {
            text: string;
        };
        BoarPedigreeID: {
            text: string;
        };
        Coeff: {
            text: string;
        };
        BreedingMode: {
            text: string;
        };
        BreedingBoarEarNumber: {
            text: string;
        };
        Score: {
            text: string;
        };
        PersonName: {
            text: string;
            requiredMessage: string;
        };
        MatchModel: {
            text: string;
            requiredMessage: string;
        };
        Property: {
            text: string;
        };
        MatchMethod: {
            text: string;
            requiredMessage: string;
            sowToBoar: string;
            boarToSow: string;
        };
        PigStage: {
            text: string;
            requiredMessage: string;
            sowRequiredMessage: string;
            boarRequiredMessage: string;
        };
        select: {
            text: string;
            selectSow: string;
            selectBoar: string;
        };
        all: {
            text: string;
        };
        options: {
            sowPanel: string;
            boarPanel: string;
            productSowBirthTimes: string;
            productBoarAge: string;
            backSowAge: string;
            backBoarAge: string;
        };
        msg: {
            dataEmpty: string;
            detailEmpty: string;
        };
        tSelect: {
            text: string;
        };

        createPageTitle: string;
        editPageTitle: string;
    };
    semenPurchase: {
        title: string;
        index: string;
        createPageTitle: string;
        editPageTitle: string;
        dataDate: {
            text: string;
        };
        PersonName: {
            text: string;
            requiredMessage: string;
            placeholder: string;
        };
        productName: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        warehouse: {
            text: string;
            emptyMessage: string;
            placeholder: string;
        };
        supplierName: {
            text: string;
            emptyMessage: string;
            placeholder: string;
        };
        ticketedPoint: {
            text: string;
            placeholder: string;
            emptyMessage: string;
        };
        purchaseAbstract: {
            text: string;
            emptyMessage: string;
            placeholder: string;
        };
        purchaseType: {
            text: string;
            emptyMessage: string;
            placeholder: string;
        };
        noBindingProducts: {
            text: string;
        };
        paymentApplication: {
            text: string;
        };
        noRelevantdata: {
            text: string;
        };
        totalAmountlimit: {
            text: string;
        };
        unitName: {
            text: string;
        };
        semenBatch: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        inCount: {
            text: string;
            emptyMessage: string;
        };
        adjustCount: {
            text: string;
        };
        finalCount: {
            text: string;
        };
        price: {
            text: string;
            emptyMessage: string;
        };
        totalPrice: {
            text: string;
        };
        adjustPrice: {
            text: string;
        };
        finalPrice: {
            text: string;
        };
        present: {
            text: string;
        };
    };
    semenSale: {
        title: string;
        index: string;
        createPageTitle: string;
        editPageTitle: string;
        dataDate: {
            text: string;
        };
        PersonName: {
            text: string;
            requiredMessage: string;
            placeholder: string;
        };
        productName: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        warehouse: {
            text: string;
            emptyMessage: string;
            placeholder: string;
        };
        ticketedPoint: {
            text: string;
            placeholder: string;
            emptyMessage: string;
        };
        saleAbstract: {
            text: string;
            emptyMessage: string;
            placeholder: string;
        };
        saleType: {
            text: string;
            emptyMessage: string;
            placeholder: string;
        };
        noBindingProducts: {
            text: string;
        };
        paymentApplication: {
            text: string;
        };
        noRelevantdata: {
            text: string;
        };
        totalAmountlimit: {
            text: string;
        };
        unitName: {
            text: string;
        };
        semenBatch: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        quantity: {
            text: string;
            emptyMessage: string;
        };
        price: {
            text: string;
            emptyMessage: string;
        };
        totalPrice: {
            text: string;
        };
        present: {
            text: string;
        };
        customer: {
            text: string;
            emptyMessage: string;
            placeholder: string;
        };
        market: {
            text: string;
            emptyMessage: string;
            placeholder: string;
        };
    };
    record: {
        searchText: string;
        qichu: string;
        nodata: string;
        page: string;
        zhuanru: string;
        siwang: string;
        taotai: string;
        sitaolv: string;
        sow: string;
        canpeisow: string;
        birthsow: string;
        peizhuilv: string;
        shijishipei: string;
        yugufenmianlv: string;
        zhuanzhong: string;
        sowhoubeiliyonglv: string;
        renshensow: string;
        shipeisow: string;
        shipeilv: string;
        houbeisiwanglv: string;
        yufeisiwanglv: string;
        baoyusiwanglv: string;
        youxiaochanzai: string;
        duannaizaizhu: string;
        duannaichenghuolv: string;
        shangqiduannaichenghuolv: string;
        chulan: string;
        chulanlv: string;
        shangqichulanlv: string;
        yuqifenmian: string;
        shijifenmian: string;
        fenmianlv: string;
        sqfenmianlv: string;
        baoyushangshi: string;
        baoyushangshilv: string;
        yufeishangshi: string;
        yufeishangshilv: string;
        pingjuncunlan: string;
        xingzen: string;
        gongzhugengxinlv: string;
        seven: string;
        month: string;
        custom: string;
        rank: string;
        housename: string;
        boarsitaolv: string;
        lastsitaolv: string;
        person: string;
        sowsitaolv: string;
        lastpeizhuilv: string;
        lastyugufenmianlv: string;
        lastliyonglv: string;
        last: string;
        siwanglv: string;
        shiwang: string;
        shangqishiwang: string;
        yufei: string;
        gengxinlv: string;
    };
    modifyTool: {
        description: string;
        desAge1: string;
        desAge2: string;
        desAge3: string;
        history: string;
        date: string;
        feizhupici: string;
        search: string;
        import: string;
        save: string;
        index: string;
        cunlan: string;
        indate: string;
        inage: string;
        indateafter: string;
        inageafter: string;
        nodata: string;
        tiaozhenren: string;
        createdate: string;
        select: string;
        warntip: string;
        success: string;
        error: string;
        empty: string;
        desbatch1: string;
        desbatch2: string;
        desbatch3: string;
        tiaozhenqijian: string;
        tiaozhenjiancha: string;
        house: string;
        batchbefore: string;
        ear: string;
        currenthouse: string;
        batchafter: string;
        tiaozhentiaojian: string;
        operationtime: string;
        operation: string;
        delete: string;
        deltip: string;
        no: string;
        yes: string;
        housemust: string;
        warntipbatch: string;
    };
    purchasingManagement: {
        other: string;
        etc: string;
        unitName: string;
        supplier: string;
        expand: string;
        warehouseIn: string;
        addUp: string;
        save: string;
        materialType: string;
        placeholderProduct: string;
        inputPrice: string;
        search: string;
        purchaseHistory: string;
        purchaseLast: string;
        piece: string;
        product: string;
        buyAgain: string;
        loading: string;
    };
    materialRequisition: {
        recipientsType: string;
        expand: string;
        recipientsObject: string;
        recipientsWarehouse: string;
        materialType: string;
        placeholderProduct: string;
        addUp: string;
        save: string;
        search: string;
        product: string;
        loading: string;
        inventory: string;
        recipientsHistory: string;
    };
    materialCheck: {
        warehouseIn: string;
        materialType: string;
        placeholderProduct: string;
        appendProduct: string;
        loading: string;
        save: string;
        inventory: string;
        checkHistory: string;
    };
    menuSummaryList: {
        JCSZ: string;
        SCLR: string;
        SCCX: string;
        ZHBB: string;
        SCFX: string;
        FZFX: string;
    };
    ///////////////////////禽联网////////////////////////
    zoning: {
        title: string;
        ZoningID: {
            text: string;
        };
        ZoningName: {
            text: string;
        };
        ZoningCode: {
            text: string;
        };
        createPageTitle: string;
        editPageTitle: string;
    };
    StrainLine: {
        title: string;
        StrainLineID: {
            text: string;
        };
        StrainLineName: {
            text: string;
        };
        StrainLineNo: {
            text: string;
        };
        PoultryType: {
            text: string;
        };
        Status: {
            text: string;
            trueText: string;
            falseText: string;
        };
        createPageTitle: string;
        editPageTitle: string;
    };
    breedingSetting: {
        title: string;
        BreedingName: {
            text: string;
            requiredMessage: string;
        };
        MarketName: {
            text: string;
        };
        Status: {
            text: string;
            trueText: string;
            falseText: string;
            emptyMessage: string;
        };
        PoultryType: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        remarks: {
            text: string;
        };
        BreedingNo: {
            text: string;
        };
        createPageTitle: string;
        editPageTitle: string;
    };
    hatcher: {
        title: string;
        HatcherName: {
            text: string;
            requiredMessage: string;
        };
        Status: {
            text: string;
            trueText: string;
            falseText: string;
            emptyMessage: string;
        };
        ZoningID: {
            text: string;
        };
        remarks: {
            text: string;
        };
        createPageTitle: string;
        editPageTitle: string;
    };
    hatchBatch: {
        title: string;
        BatchName: {
            text: string;
            requiredMessage: string;
        };
        remarks: {
            text: string;
        };
        createPageTitle: string;
        editPageTitle: string;
    };
    zqbatch: {
        title: string;
        BatchName: {
            text: string;
        };
        DataDate: {
            text: string;
        };
        DaysOld: {
            text: string;
        };
        Remarks: {
            text: string;
        };
        GenerationLine: {
            text: string;
        };
        StrainLineID: {
            text: string;
        };
        BreedStandardID: {
            text: string;
        };
        BreedingID: {
            text: string;
        };
        DescentLine: {
            text: string;
        };
        CreatedDate: {
            text: string;
        };
        ModifiedDate: {
            text: string;
        };
        BatchType: {
            text: string;
        };
        ProductID: {
            text: string;
        };
        PostBreedingID: {
            text: string;
        };
        FarmID: {
            text: string;
        };
        createPageTitle: string;
        editPageTitle: string;
    };
    chickenFarmSetting: {
        ChickenFarmName: {
            text: string;
            short: string;
        };
        ChickenFarmShortName: {
            text: string;
            short: string;
        };
        ChickenFarmNumer: {
            text: string;
            short: string;
        };
        ChickenFarmType: {
            text: string;
            poultry: string;
            hatchery: string;
            short: string;
        };
        FullAddress: {
            text: string;
        };
        PersonId: {
            text: string;
        };
        ICount: {
            text: string;
        };
        title: string;
        PigFarmId: {
            text: string;
        };
        PigFarmFullName: {
            text: string;
        };
        PigFarmName: {
            text: string;
        };
        Begindate: {
            text: string;
        };
        AreaId: {
            requestMessage: string;
        };
        TicketedPointID: {
            requestMessage: string;
        };
        Address: {
            text: string;
        };
        IsUse: {
            text: string;
            trueText: string;
            falseText: string;
        };
        Warehouse: {
            poultry: string;
            hatchery: string;
        };
        create: string;
        edit: string;
        delete: string;
        createPageTitle: string;
        editPageTitle: string;
        createPageTitle2: string;
        editPageTitle2: string;
        addressMessage: string;
    };
    chickenYHFarmSetting: {
        ChickenFarmName: {
            text: string;
            short: string;
        };
        CoordinateAddr: {
            text: string;
        };
        AreaID: {
            text: string;
        };
        StartDate: {
            text: string;
        };
        province: {
            text: string;
            short: string;
        };
        city: {
            text: string;
            short: string;
        };
        area: {
            text: string;
            short: string;
        };
        HenHouseID: {
            text: string;
            short: string;
        };
        iCount: {
            text: string;
            short: string;
        };
        AreaSize: {
            text: string;
            short: string;
        };
        WarehouseID: {
            text: string;
            short: string;
        };
        FeedWarehouseID: {
            text: string;
            short: string;
        };
        DrugWarehouseID: {
            text: string;
            short: string;
        };
        ChickenFarmType: {
            text: string;
            poultry: string;
            hatchery: string;
            short: string;
        };
        MarketName: {
            text: string;
        };
        FullAddress: {
            text: string;
        };
        PersonId: {
            text: string;
        };
        ICount: {
            text: string;
        };
        title: string;
        PigFarmId: {
            text: string;
        };
        PigFarmFullName: {
            text: string;
        };
        PigFarmName: {
            text: string;
        };
        Begindate: {
            text: string;
        };
        AreaId: {
            requestMessage: string;
        };
        TicketedPointID: {
            requestMessage: string;
        };
        Address: {
            text: string;
        };
        IsUse: {
            text: string;
            trueText: string;
            falseText: string;
        };
        Warehouse: {
            poultry: string;
            hatchery: string;
        };
        create: string;
        edit: string;
        delete: string;
        createPageTitle: string;
        editPageTitle: string;
        createPageTitle2: string;
        editPageTitle2: string;
        addressMessage: string;
    };
    YHFamerShortcutSetting: {
        YhName: {
            text: string;
            short: string;
        };
        Remarks: {
            text: string;
        };
        AreaID: {
            text: string;
        };
        StartDate: {
            text: string;
        };
        province: {
            text: string;
            short: string;
        };
        city: {
            text: string;
            short: string;
        };
        area: {
            text: string;
            short: string;
        };
        HenHouseID: {
            text: string;
            short: string;
        };
        iCount: {
            text: string;
            short: string;
        };
        AreaSize: {
            text: string;
            short: string;
        };
        WarehouseID: {
            text: string;
            short: string;
        };
        FeedWarehouseID: {
            text: string;
            short: string;
        };
        DrugWarehouseID: {
            text: string;
            short: string;
        };
        ChickenFarmType: {
            text: string;
            poultry: string;
            hatchery: string;
            short: string;
        };
        MarketName: {
            text: string;
        };
        FullAddress: {
            text: string;
        };
        PersonId: {
            text: string;
        };
        ICount: {
            text: string;
        };
        title: string;
        PigFarmId: {
            text: string;
        };
        PigFarmFullName: {
            text: string;
        };
        PigFarmName: {
            text: string;
        };
        Begindate: {
            text: string;
        };
        AreaId: {
            requestMessage: string;
        };
        TicketedPointID: {
            requestMessage: string;
        };
        Address: {
            text: string;
        };
        IsUse: {
            text: string;
            trueText: string;
            falseText: string;
        };
        Warehouse: {
            poultry: string;
            hatchery: string;
        };
        create: string;
        edit: string;
        delete: string;
        createPageTitle: string;
        editPageTitle: string;
        createPageTitle2: string;
        editPageTitle2: string;
        addressMessage: string;
    };
    yhfarmerInformationSetting: {
        YhName: {
            text: string;
            short: string;
        };
        FullName: {
            text: string;
            short: string;
        };
        PersonName: {
            text: string;
            short: string;
        };
        Remarks: {
            text: string;
        };
        AreaID: {
            text: string;
        };
        StartDate: {
            text: string;
        };
        MarketName: {
            text: string;
        };
        YHPersonName: {
            text: string;
        };
        Phone: {
            text: string;
        };
        IdCardNumber: {
            text: string;
        };
        Sex: {
            text: string;
        };
        MnemonicCode: {
            text: string;
        };
        FullAddress: {
            text: string;
        };
        create: string;
        edit: string;
        delete: string;
        createPageTitle: string;
        editPageTitle: string;
        createPageTitle2: string;
        editPageTitle2: string;
        addressMessage: string;
    };
    productannexed: {
        cProductName: {
            text: string;
        };
        UnitName: {
            text: string;
        };
        UnitExtName: {
            text: string;
        };
        BatchRuleName: {
            text: string;
        };
        plName: {
            text: string;
        };
        dhName: {
            text: string;
        };
        iSortPlus: {
            text: string;
            requiredMessage: string;
        };
        create: string;
        edit: string;
        delete: string;
        createPageTitle: string;
        editPageTitle: string;
    };
    henhouseSetting: {
        title: string;
        HenhouseName: {
            text: string;
            requiredMessage: string;
        };
        RearType: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        PhaseType: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        ChickenFarmID: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        ZoningID: {
            text: string;
        };
        DrugWarehouseID: {
            text: string;
        };
        FeedWarehouseID: {
            text: string;
        };
        EggWarehouseID: {
            text: string;
        };
        iCount: {
            text: string;
        };
        AreaSize: {
            text: string;
        };
        remarks: {
            text: string;
        };
        HenhouseNumer: {
            text: string;
        };
        createPageTitle: string;
        editPageTitle: string;
    };
    Remarks: {
        headtext: string;
        detailtext: string;
    };
    zqintochicken: {
        title: string;
        NumericalOrder: {
            text: string;
        };
        ChickenSource: {
            text: string;
            requiredMessage: string;
        };
        Number: {
            text: string;
        };
        DataDate: {
            text: string;
            requiredMessage: string;
        };
        ChickenFarmID: {
            text: string;
            requiredMessage: string;
        };
        BatchID: {
            text: string;
            requiredMessage: string;
        };
        SupplierID: {
            text: string;
            requiredMessage: string;
        };
        WarehouseID: {
            text: string;
            requiredMessage: string;
        };
        BreedName: {
            text: string;
        };
        DaysOld: {
            text: string;
        };
        FreightFor: {
            text: string;
            requiredMessage: string;
        };
        createPageTitle: string;
        editPageTitle: string;
    };
    zqcalcmsbreedcost: {
        title: string;
        DataDate: {
            text: string;
        };
        EnterpriseName: {
            text: string;
        };
        Remarks: {
            text: string;
        };
        OwnerName: {
            text: string;
        };
        ModifiedDate: {
            text: string;
        };
    };
    zqintochickenDetail: {
        HenhouseID: {
            text: string;
            required: string;
        };
        SexType: {
            text: string;
            required: string;
        };
        ProductName: {
            text: string;
            required: string;
        };
        Packages: {
            text: string;
            message: string;
            required: string;
            patternMessage: string;
        };
        ValueQuantity: {
            text: string;
            required: string;
            message: string;
            patternMessage: string;
        };
        GiftQuantity: {
            text: string;
            required: string;
            message: string;
            patternMessage: string;
        };
        DeliveryTotal: {
            text: string;
            required: string;
            message: string;
            patternMessage: string;
        };
        ValueTotal: {
            text: string;
            required: string;
            message: string;
            patternMessage: string;
        };
        UnitPrice: {
            text: string;
            required: string;
            message: string;
            patternMessage: string;
        };
        Weight: {
            text: string;
            message: string;
            patternMessage: string;
        };
        TaxPrice: {
            text: string;
            message: string;
            patternMessage: string;
        };
        AmountTotal: {
            text: string;
            required: string;
            message: string;
            patternMessage: string;
        };
        LossTotal: {
            text: string;
            required: string;
            message: string;
            patternMessage: string;
        };
        IntoHouseTotal: {
            text: string;
            required: string;
            message: string;
            patternMessage: string;
        };
        createPageTitle: string;
        editPageTitle: string;
    };
    YhChickenReceive: {
        title: string;
        NumericalOrder: {
            text: string;
        };
        Abstract: {
            text: string;
            requiredMessage: string;
        };
        OutWarehouse: {
            text: string;
            requiredMessage: string;
        };
        InWarehouse: {
            text: string;
            requiredMessage: string;
        };
        SourceType: {
            text: string;
            requiredMessage: string;
        };
        Driver: {
            text: string;
            requiredMessage: string;
        };
        TotalQuantity: {
            text: string;
            requiredMessage: string;
        };
        ConfirmStatus: {
            text: string;
            requiredMessage: string;
        };
        ChickenSource: {
            text: string;
            requiredMessage: string;
        };
        Number: {
            text: string;
        };
        DataDate: {
            text: string;
            requiredMessage: string;
        };
        ChickenFarmID: {
            text: string;
            requiredMessage: string;
        };
        YHFarmerID: {
            text: string;
            requiredMessage: string;
        };
        YHBatch: {
            text: string;
            requiredMessage: string;
        };
        SupplierID: {
            text: string;
            requiredMessage: string;
        };
        WarehouseID: {
            text: string;
            requiredMessage: string;
        };
        ChickenType: {
            text: string;
        };
        isbegin: {
            text: string;
        };
        BreedName: {
            text: string;
        };
        DaysOld: {
            text: string;
        };
        FreightFor: {
            text: string;
            requiredMessage: string;
        };
        createPageTitle: string;
        editPageTitle: string;
    };
    YhChickenReceiveDetail: {
        HenhouseID: {
            text: string;
            required: string;
        };
        HenHouseName: {
            text: string;
            required: string;
        };
        Gift: {
            text: string;
        };
        MeasureUnitName: {
            text: string;
            required: string;
        };
        ProductBatchID: {
            text: string;
            required: string;
        };
        ProductName: {
            text: string;
            required: string;
        };
        HatchBatchID: {
            text: string;
        };
        DonateQuantity: {
            text: string;
            required: string;
            message: string;
            patternMessage: string;
        };
        TotalQuantity: {
            text: string;
            required: string;
            message: string;
            patternMessage: string;
        };
        FarmID: {
            text: string;
            required: string;
            message: string;
            patternMessage: string;
        };
        ValueQuantity: {
            text: string;
            required: string;
            message: string;
            patternMessage: string;
        };
        UnitPrice: {
            text: string;
            required: string;
            message: string;
            patternMessage: string;
        };
        BreedingID: {
            text: string;
        };
        Debeaking: {
            text: string;
        };
        ImmuneSubjectID: {
            text: string;
        };
        AmountTotal: {
            text: string;
            required: string;
            message: string;
            patternMessage: string;
        };
        BatchID: {
            text: string;
        };
        createPageTitle: string;
        editPageTitle: string;
    };
    YhBatchTransfer: {
        title: string;
        NumericalOrder: {
            text: string;
        };
        Abstract: {
            text: string;
            requiredMessage: string;
        };
        OutWarehouse: {
            text: string;
            requiredMessage: string;
        };
        InWarehouse: {
            text: string;
            requiredMessage: string;
        };
        Driver: {
            text: string;
            requiredMessage: string;
        };
        TotalQuantity: {
            text: string;
            requiredMessage: string;
        };
        ConfirmStatus: {
            text: string;
            requiredMessage: string;
        };
        ChickenSource: {
            text: string;
            requiredMessage: string;
        };
        Number: {
            text: string;
        };
        DataDate: {
            text: string;
            requiredMessage: string;
        };
        ChickenFarmID: {
            text: string;
            requiredMessage: string;
        };
        OldYHFarmerID: {
            text: string;
            requiredMessage: string;
        };
        YHFarmerID: {
            text: string;
            requiredMessage: string;
        };
        OldYHFarmerContract: {
            text: string;
            requiredMessage: string;
        };
        YHFarmerContract: {
            text: string;
            requiredMessage: string;
        };
        OldSerialNo: {
            text: string;
            requiredMessage: string;
        };
        SerialNo: {
            text: string;
            requiredMessage: string;
        };
        YHBatch: {
            text: string;
            requiredMessage: string;
        };
        TransferReason: {
            text: string;
            requiredMessage: string;
        };
        ChickenType: {
            text: string;
        };
        isbegin: {
            text: string;
        };
        BreedName: {
            text: string;
        };
        DaysOld: {
            text: string;
        };
        FreightFor: {
            text: string;
            requiredMessage: string;
        };
        createPageTitle: string;
        editPageTitle: string;
    };
    YhBatchTransferDetail: {
        HenhouseID: {
            text: string;
            required: string;
        };
        HenHouseName: {
            text: string;
            required: string;
        };
        iSortPlus: {
            text: string;
        };
        MeasureUnitName: {
            text: string;
            required: string;
        };
        ProductBatchID: {
            text: string;
            required: string;
        };
        ProductName: {
            text: string;
            required: string;
        };
        HatchBatchID: {
            text: string;
        };
        DonateQuantity: {
            text: string;
            required: string;
            message: string;
            patternMessage: string;
        };
        TotalQuantity: {
            text: string;
            required: string;
            message: string;
            patternMessage: string;
        };
        WarehouseID: {
            text: string;
        };
        ValueQuantity: {
            text: string;
            required: string;
            message: string;
            patternMessage: string;
        };
        UnitPrice: {
            text: string;
            required: string;
            message: string;
            patternMessage: string;
        };
        BreedingID: {
            text: string;
        };
        Specification: {
            text: string;
        };
        Quantity: {
            text: string;
        };
        Packages: {
            text: string;
        };
        BatchID: {
            text: string;
        };
        createPageTitle: string;
        editPageTitle: string;
    };
    YhMaterialReceive: {
        title: string;
        NumericalOrder: {
            text: string;
        };
        Abstract: {
            text: string;
            requiredMessage: string;
        };
        OutWarehouse: {
            text: string;
            requiredMessage: string;
        };
        InWarehouse: {
            text: string;
            requiredMessage: string;
        };
        Driver: {
            text: string;
            requiredMessage: string;
        };
        TotalQuantity: {
            text: string;
            requiredMessage: string;
        };
        ConfirmStatus: {
            text: string;
            requiredMessage: string;
        };
        ChickenSource: {
            text: string;
            requiredMessage: string;
        };
        isbegin: {
            text: string;
        };
        Number: {
            text: string;
        };
        DataDate: {
            text: string;
            requiredMessage: string;
        };
        ChickenFarmID: {
            text: string;
            requiredMessage: string;
        };
        YHFarmerID: {
            text: string;
            requiredMessage: string;
        };
        YHBatch: {
            text: string;
            requiredMessage: string;
        };
        SupplierID: {
            text: string;
            requiredMessage: string;
        };
        WarehouseID: {
            text: string;
            requiredMessage: string;
        };
        ChickenType: {
            text: string;
        };
        BreedName: {
            text: string;
        };
        DaysOld: {
            text: string;
        };
        FreightFor: {
            text: string;
            requiredMessage: string;
        };
        createPageTitle: string;
        editPageTitle: string;
    };
    YhMaterialReceiveDetail: {
        HenhouseID: {
            text: string;
            required: string;
        };
        HenHouseName: {
            text: string;
            required: string;
        };
        Gift: {
            text: string;
        };
        MeasureUnitName: {
            text: string;
            required: string;
        };
        ProductBatchID: {
            text: string;
            required: string;
        };
        ProductName: {
            text: string;
            required: string;
        };
        HatchBatchID: {
            text: string;
        };
        Packages: {
            text: string;
            required: string;
            message: string;
            patternMessage: string;
        };
        Quantity: {
            text: string;
            required: string;
            message: string;
            patternMessage: string;
        };
        FarmID: {
            text: string;
            required: string;
            message: string;
            patternMessage: string;
        };
        ValueQuantity: {
            text: string;
            required: string;
            message: string;
            patternMessage: string;
        };
        UnitPrice: {
            text: string;
            required: string;
            message: string;
            patternMessage: string;
        };
        BreedingID: {
            text: string;
        };
        Debeaking: {
            text: string;
        };
        ImmuneSubjectID: {
            text: string;
        };
        AmountTotal: {
            text: string;
            required: string;
            message: string;
            patternMessage: string;
        };
        BatchID: {
            text: string;
        };
        createPageTitle: string;
        editPageTitle: string;
    };
    zqfmbiologyassets: {
        ModifiedDate: {
            text: string;
        };
        CreateType: {
            text: string;
        };
        OwnerName: {
            text: string;
        };
        ChickenFarmName: {
            text: string;
        };
        Number: {
            text: string;
        };
        DataDate: {
            text: string;
        };
        calculation: {
            text: string;
        };
        HenhouseID: {
            text: string;
            required: string;
        };
        BatchID: {
            text: string;
            required: string;
        };
        BatchType: {
            text: string;
            required: string;
        };
        Quantity: {
            text: string;
            required: string;
        };
        OriginalValue: {
            text: string;
            required: string;
        };
        DescentLine: {
            text: string;
            required: string;
        };
        Amount: {
            text: string;
            required: string;
        };
        SexType: {
            text: string;
            required: string;
        };
        ProductID: {
            text: string;
            required: string;
        };
        BreedingID: {
            text: string;
            required: string;
        };
        AccruedMonth: {
            text: string;
            message: string;
            required: string;
            patternMessage: string;
        };
        DepreciationAccumulated: {
            text: string;
            required: string;
            message: string;
            patternMessage: string;
        };
        SerialNum: {
            text: string;
            required: string;
            message: string;
            patternMessage: string;
        };
        ResidualValueType: {
            text: string;
            required: string;
            message: string;
            patternMessage: string;
        };
        ResidualValueUnit: {
            text: string;
            required: string;
            message: string;
            patternMessage: string;
        };
        ResidualValueRate: {
            text: string;
            required: string;
            message: string;
            patternMessage: string;
        };
        ResidualValue: {
            text: string;
            required: string;
            message: string;
            patternMessage: string;
        };
        DepreciationAllMonths: {
            text: string;
            required: string;
            message: string;
            patternMessage: string;
        };
        createPageTitle: string;
        editPageTitle: string;
    };
    ZqFmdepreCiationBiology: {
        title: string;
        CreatedDate: {
            text: string;
        };
        CreateType: {
            text: string;
        };
        OwnerName: {
            text: string;
        };
        ChickenFarmName: {
            text: string;
        };
        Number: {
            text: string;
        };
        DataDate: {
            text: string;
        };
        calculation: {
            text: string;
        };
        HenhouseID: {
            text: string;
            required: string;
        };
        BatchID: {
            text: string;
            required: string;
        };
        BatchType: {
            text: string;
            required: string;
        };
        Quantity: {
            text: string;
            required: string;
        };
        EffectMonth: {
            text: string;
            required: string;
        };
        OriginalValue: {
            text: string;
            required: string;
        };
        DescentLine: {
            text: string;
            required: string;
        };
        Amount: {
            text: string;
            required: string;
        };
        SexType: {
            text: string;
            required: string;
        };
        DepreciationMonthAmount: {
            text: string;
            required: string;
        };
        DepreciationAccumulated: {
            text: string;
            required: string;
        };
        NetValue: {
            text: string;
            required: string;
        };

        createPageTitle: string;
        editPageTitle: string;
    };
    zqbreedcostbeginning: {
        DataDate: {
            text: string;
            requiredMessage: string;
        };
        NumericalOrder: {
            text: string;
            required: string;
        };
        Remarks: {
            text: string;
            required: string;
        };
        OwnerName: {
            text: string;
            required: string;
        };
        AuditorName: {
            text: string;
            required: string;
        };
        ChickenFarmID: {
            text: string;
            required: string;
        };
        HenhouseID: {
            text: string;
            required: string;
        };
        BatchID: {
            text: string;
            required: string;
        };
        Quantity: {
            text: string;
            required: string;
        };
        OriginalValue: {
            text: string;
            required: string;
        };
        Amount: {
            text: string;
            required: string;
        };
        SexType: {
            text: string;
            required: string;
        };
        ProductName: {
            text: string;
            required: string;
        };
        Packages: {
            text: string;
            message: string;
            required: string;
            patternMessage: string;
        };
        ValueQuantity: {
            text: string;
            required: string;
            message: string;
            patternMessage: string;
        };
        GiftQuantity: {
            text: string;
            required: string;
            message: string;
            patternMessage: string;
        };
        DeliveryTotal: {
            text: string;
            required: string;
            message: string;
            patternMessage: string;
        };
        ValueTotal: {
            text: string;
            required: string;
            message: string;
            patternMessage: string;
        };
        UnitPrice: {
            text: string;
            required: string;
            message: string;
            patternMessage: string;
        };
        AmountTotal: {
            text: string;
            required: string;
            message: string;
            patternMessage: string;
        };
        LossTotal: {
            text: string;
            required: string;
            message: string;
            patternMessage: string;
        };
        IntoHouseTotal: {
            text: string;
            required: string;
            message: string;
            patternMessage: string;
        };
        createPageTitle: string;
        editPageTitle: string;
    };
    zqimmune: {
        title: string;
        NumericalOrder: {
            text: string;
        };
        Number: {
            text: string;
        };
        DataDate: {
            text: string;
            requiredMessage: string;
        };
        PersonID: {
            text: string;
            requiredMessage: string;
        };
        ImmuneRequisitionID: {
            text: string;
            requiredMessage: string;
        };
        WarehouseID: {
            text: string;
            requiredMessage: string;
        };
        createPageTitle: string;
        editPageTitle: string;
    };
    zqimmuneDetail: {
        HenhouseID: {
            text: string;
            required: string;
        };
        BatchID: {
            text: string;
            required: string;
        };
        SexType: {
            text: string;
            required: string;
        };
        ProductID: {
            text: string;
            required: string;
        };
        DosageForm: {
            text: string;
            required: string;
        };
        ProductBatchID: {
            text: string;
        };
        ExpireDate: {
            text: string;
        };
        MeasureUnitName: {
            text: string;
        };
        Quantity: {
            text: string;
            message: string;
            patternMessage: string;
        };
        OccurQuantity: {
            text: string;
            message: string;
            patternMessage: string;
        };
        WasteQuantity: {
            text: string;
            message: string;
            patternMessage: string;
        };
        TotalQuantity: {
            text: string;
            required: string;
            message: string;
            patternMessage: string;
        };
        OccurDosage: {
            text: string;
            patternMessage: string;
        };
        ImmuneType: {
            text: string;
        };
        DosageUnitName: {
            text: string;
        };
        DetailRemarks: {
            text: string;
        };
    };
    zqsetstock: {
        title: string;
        NumericalOrder: {
            text: string;
        };
        Number: {
            text: string;
        };
        DataDate: {
            text: string;
            requiredMessage: string;
        };
        ChickenFarmID: {
            text: string;
            requiredMessage: string;
        };
        createPageTitle: string;
        editPageTitle: string;
    };
    zqsetstockDetail: {
        HenhouseID: {
            text: string;
        };
        BatchID: {
            text: string;
        };
        BreedingName: {
            text: string;
        };
        DaysOld: {
            text: string;
        };
        MaleQuantity: {
            text: string;
        };
        FemaleQuantity: {
            text: string;
        };
    };
    zqchickimmune: {
        title: string;
        NumericalOrder: {
            text: string;
        };
        Number: {
            text: string;
        };
        DataDate: {
            text: string;
            requiredMessage: string;
        };
        PersonID: {
            text: string;
            requiredMessage: string;
        };
        MarketID: {
            text: string;
            requiredMessage: string;
        };
        WarehouseID: {
            text: string;
            requiredMessage: string;
        };
        createPageTitle: string;
        editPageTitle: string;
    };
    zqchickimmuneDetail: {
        ProductID: {
            text: string;
            required: string;
        };
        ProductBatchID: {
            text: string;
        };
        ExpireDate: {
            text: string;
        };
        MeasureUnitName: {
            text: string;
        };
        TotalQuantity: {
            text: string;
            message: string;
            patternMessage: string;
        };
        WasteQuantity: {
            text: string;
            message: string;
            patternMessage: string;
        };
        ConsumeQuantity: {
            text: string;
            message: string;
            patternMessage: string;
        };
        ImmuneSubjectID: {
            text: string;
            required: string;
        };
        DetailRemarks: {
            text: string;
        };
    };
    zqpharmacy: {
        title: string;
        NumericalOrder: {
            text: string;
        };
        Number: {
            text: string;
        };
        DataDate: {
            text: string;
            requiredMessage: string;
        };
        PersonID: {
            text: string;
            requiredMessage: string;
        };
        WarehouseID: {
            text: string;
            requiredMessage: string;
        };
        createPageTitle: string;
        editPageTitle: string;
    };
    zqpharmacyDetail: {
        HenhouseID: {
            text: string;
            required: string;
        };
        BatchID: {
            text: string;
            required: string;
        };
        SexType: {
            text: string;
            required: string;
        };
        ProductID: {
            text: string;
            required: string;
        };
        Purpose: {
            text: string;
            required: string;
        };
        ProductBatchID: {
            text: string;
        };
        MeasureUnitName: {
            text: string;
        };
        Quantity: {
            text: string;
            message: string;
            patternMessage: string;
        };
        DrugsQuantity: {
            text: string;
            message: string;
            patternMessage: string;
            required: string;
        };
        DrugsWay: {
            text: string;
        };
        DrugsDose: {
            text: string;
        };
        DetailRemarks: {
            text: string;
        };
    };
    zqegginventory: {
        title: string;
        NumericalOrder: {
            text: string;
        };
        Number: {
            text: string;
        };
        DataDate: {
            text: string;
            requiredMessage: string;
        };
        PersonID: {
            text: string;
            requiredMessage: string;
        };
        WarehouseID: {
            text: string;
            requiredMessage: string;
        };
        TicketedPointID: {
            text: string;
            requiredMessage: string;
        };
        createPageTitle: string;
        editPageTitle: string;
    };
    zqegginventoryDetail: {
        ProductID: {
            text: string;
            required: string;
        };
        Specification: {
            text: string;
        };
        ProductBatchID: {
            text: string;
        };
        MeasureUnitExtName: {
            text: string;
        };
        QuantityExt: {
            text: string;
            patternMessage: string;
        };
        MeasureUnitName: {
            text: string;
        };
        StockQuantity: {
            text: string;
            patternMessage: string;
        };
        Quantity: {
            text: string;
            patternMessage: string;
        };
        DifferenceQuantity: {
            text: string;
            patternMessage: string;
        };
        UnitCost: {
            text: string;
            patternMessage: string;
        };
        Amount: {
            text: string;
            patternMessage: string;
        };
        HenhouseID: {
            text: string;
        };
        BatchID: {
            text: string;
        };
        ChickenFarmID: {
            text: string;
        };
        BreedingID: {
            text: string;
        };
        ProductionDate: {
            text: string;
        };
        DaysWeek: {
            text: string;
        };
        BatchRemarks: {
            text: string;
        };
        Remarks: {
            text: string;
        };
    };
    zqweigh: {
        title: string;
        NumericalOrder: {
            text: string;
        };
        Number: {
            text: string;
        };
        DataDate: {
            text: string;
            requiredMessage: string;
        };
        HenhouseID: {
            text: string;
            requiredMessage: string;
        };
        BatchID: {
            text: string;
            requiredMessage: string;
        };
        WeeksOld: {
            text: string;
        };
        WeighAim: {
            text: string;
            requiredMessage: string;
        };
        QuantityPerWeigh: {
            text: string;
            requiredMessage: string;
            patternMessage: string;
        };
        BreedingName: {
            text: string;
        };
        createPageTitle: string;
        editPageTitle: string;
    };
    zqweighDetail: {
        SexType: {
            text: string;
            required: string;
        };
        WeightLevel: {
            text: string;
            required: string;
        };
        WeightPerWeigh: {
            text: string;
            required: string;
            message: string;
            patternMessage: string;
        };
        FenceSerialNo: {
            text: string;
        };
    };
    zqlayeggs: {
        title: string;
        NumericalOrder: {
            text: string;
        };
        Number: {
            text: string;
        };
        DataDate: {
            text: string;
            requiredMessage: string;
        };
        HenhouseID: {
            text: string;
            requiredMessage: string;
        };
        BatchID: {
            text: string;
            requiredMessage: string;
        };
        PostBreedingName: {
            text: string;
            requiredMessage: string;
        };
        WarehouseID: {
            text: string;
            requiredMessage: string;
        };
        LayEggsSettingCateID: {
            text: string;
            requiredMessage: string;
        };
        WeeksOld: {
            text: string;
        };
        AvgEgg: {
            text: string;
            patternMessage: string;
        };
        SideEggQuantity: {
            text: string;
            patternMessage: string;
        };
        createPageTitle: string;
        editPageTitle: string;
    };

    zqlayeggsDetail: {
        LayEggName: {
            text: string;
        };
        ProductName: {
            text: string;
        };
        MeasureUnitNameExt: {
            text: string;
        };
        QuantityExt: {
            text: string;
            patternMessage: string;
        };
        MeasureUnitName: {
            text: string;
        };
        Quantity: {
            text: string;
            patternMessage: string;
        };
        UnicumUnitName: {
            text: string;
        };
        UnicumQuantity: {
            text: string;
            patternMessage: string;
        };
        StatUnitName: {
            text: string;
        };
        StatQuantity: {
            text: string;
            patternMessage: string;
        };
        ProductBatchName: {
            text: string;
        };
        productMsg: string;
        slMsg: string;
        gtMsg: string;
        tjMsg: string;
        slqMsg: string;
        gtqMsg: string;
        fzqMsg: string;
        tjqMsg: string;
    };

    layeggs: {
        title: string;
        NumericalOrder: {
            text: string;
        };
        Number: {
            text: string;
        };
        DataDate: {
            text: string;
            requiredMessage: string;
        };
        WarehouseID: {
            text: string;
            requiredMessage: string;
        };
        createPageTitle: string;
        editPageTitle: string;
    };
    layeggsDetail: {
        LayEggName: {
            text: string;
        };
        ProductName: {
            text: string;
        };
        MeasureUnitNameExt: {
            text: string;
        };
        QuantityExt: {
            text: string;
            patternMessage: string;
        };
        MeasureUnitName: {
            text: string;
        };
        HeGeDanQuantity: {
            text: string;
            patternMessage: string;
        };
        JiXingDanQuantity: {
            text: string;
            patternMessage: string;
        };
        ShuangHuangDanQuantity: {
            text: string;
            patternMessage: string;
        };
        PoSunDanQuantity: {
            text: string;
            patternMessage: string;
        };

        RuanPiDanQuantity: {
            text: string;
            patternMessage: string;
        };
        ZangDanQuantity: {
            text: string;
            patternMessage: string;
        };
        XiaoDanQuantity: {
            text: string;
            patternMessage: string;
        };
        CaiDanQuantity: {
            text: string;
            patternMessage: string;
        };
        Quantity: {
            text: string;
            patternMessage: string;
        };
        UnicumUnitName: {
            text: string;
        };
        UnicumQuantity: {
            text: string;
            patternMessage: string;
        };
        StatUnitName: {
            text: string;
        };
        StatQuantity: {
            text: string;
            patternMessage: string;
        };
        ProductBatchName: {
            text: string;
        };
        AvgEgg: {
            text: string;
            patternMessage: string;
        };
        SideEggQuantity: {
            text: string;
            patternMessage: string;
        };
        LayEggsSettingCateID: {
            text: string;
            required: string;
        };
        HenhouseID: {
            text: string;
            required: string;
        };
        BatchID: {
            text: string;
            required: string;
        };
        PostBreedingName: {
            text: string;
            required: string;
        };
        productMsg: string;
        slMsg: string;
        gtMsg: string;
        tjMsg: string;
        slqMsg: string;
        gtqMsg: string;
        fzqMsg: string;
        tjqMsg: string;
    };
    zqloopcontrol: {
        LayEggName: {
            text: string;
        };
        ProductName: {
            text: string;
        };
        MeasureUnitNameExt: {
            text: string;
        };
        QuantityExt: {
            text: string;
            patternMessage: string;
        };
        MeasureUnitName: {
            text: string;
        };
        MaxHumidity: {
            text: string;
            patternMessage: string;
        };
        LightDuration: {
            text: string;
            patternMessage: string;
        };
        Water: {
            text: string;
            patternMessage: string;
        };
        PoSunDanQuantity: {
            text: string;
            patternMessage: string;
        };

        RuanPiDanQuantity: {
            text: string;
            patternMessage: string;
        };
        ZangDanQuantity: {
            text: string;
            patternMessage: string;
        };
        XiaoDanQuantity: {
            text: string;
            patternMessage: string;
        };
        CaiDanQuantity: {
            text: string;
            patternMessage: string;
        };
        Quantity: {
            text: string;
            patternMessage: string;
        };
        UnicumUnitName: {
            text: string;
        };
        UnicumQuantity: {
            text: string;
            patternMessage: string;
        };
        StatUnitName: {
            text: string;
        };
        StatQuantity: {
            text: string;
            patternMessage: string;
        };
        ProductBatchName: {
            text: string;
        };
        MaxTemperature: {
            text: string;
            patternMessage: string;
        };
        MaxLightIntensity: {
            text: string;
            patternMessage: string;
        };
        MinLightIntensity: {
            text: string;
            required: string;
        };
        HenhouseID: {
            text: string;
            required: string;
        };
        MinTemperature: {
            text: string;
            required: string;
        };
        MinHumidity: {
            text: string;
            required: string;
        };
        createPageTitle: string;
        editPageTitle: string;
        productMsg: string;
        slMsg: string;
        gtMsg: string;
        tjMsg: string;
        slqMsg: string;
        gtqMsg: string;
        fzqMsg: string;
        tjqMsg: string;
    };
    zqrollin: {
        title: string;
        NumericalOrder: {
            text: string;
        };
        INChickenFarmID: {
            text: string;
            requiredMessage: string;
        };
        Number: {
            text: string;
        };
        DataDate: {
            text: string;
            requiredMessage: string;
        };
        OUTChickenFarmID: {
            text: string;
            requiredMessage: string;
        };
        OutNumericalOrder: {
            text: string;
            requiredMessage: string;
            placeholder: string;
        };
        WarehouseID: {
            text: string;
            requiredMessage: string;
        };
        createPageTitle: string;
        editPageTitle: string;
    };
    zqrollinDetail: {
        OutHenhouseID: {
            text: string;
        };
        InHenhouseID: {
            text: string;
            required: string;
        };
        OutBatchID: {
            text: string;
        };
        InBatchID: {
            text: string;
            required: string;
        };
        OutSexType: {
            text: string;
        };
        InSexType: {
            text: string;
            required: string;
        };
        OutBreeding: {
            text: string;
        };
        InBreeding: {
            text: string;
        };
        OutDayOld: {
            text: string;
        };
        InDayOld: {
            text: string;
        };
        OutProduct: {
            text: string;
        };
        InProduct: {
            text: string;
            required: string;
        };
        OutQuantity: {
            text: string;
        };
        InQuantity: {
            text: string;
            required: string;
            message: string;
            patternMessage: string;
        };
    };
    ZqRollOut: {
        title: string;
        DataDate: {
            text: string;
            requiredMessage: string;
        };
        INChickenFarmID: {
            text: string;
            requiredMessage: string;
        };
        OUTChickenFarmID: {
            text: string;
            requiredMessage: string;
        };
        WarehouseID: {
            text: string;
            requiredMessage: string;
        };
        HenhouseID: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        BatchID: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        SexType: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        Quantity: {
            text: string;
            rangeMessage: string;
            patternMessage: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        createPageTitle: string;
        editPageTitle: string;
    };

    ZqPoultrySales: {
        title: string;
        DataDate: {
            text: string;
            requiredMessage: string;
        };
        ChickenFarmID: {
            text: string;
            placeholder: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        WarehouseID: {
            text: string;
            placeholder: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        CustomerID: {
            text: string;
            placeholder: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        Weight: {
            text: string;
            rangeMessage: string;
            requiredMessage: string;
            emptyMessage: string;
            patternMessage: string;
        };
        TaxPrice: {
            text: string;
            rangeMessage: string;
            requiredMessage: string;
            emptyMessage: string;
            patternMessage: string;
        };
        AmountTotal: {
            text: string;
            rangeMessage: string;
            requiredMessage: string;
            emptyMessage: string;
            patternMessage: string;
        };
        SalesmanID: {
            text: string;
            placeholder: string;
        };
        MarketID: {
            text: string;
            placeholder: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        Status: {
            text: string;
            trueText: string;
            falseText: string;
        };
        PrintName: {
            text: string;
        };
        receipt: {
            text: string;
        };
        PricingMode: {
            text: string;
            emptyMessage: string;
        };
        Amount: {
            text: string;
            patternMessage: string;
        };
        Abstract: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
            placeholder: string;
        };
        createPageTitle: string;
        editPageTitle: string;
    };
    ZqPoultrySalesDetail: {
        HenhouseID: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        BatchID: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        ProductID: {
            text: string;
        };
        BreedingID: {
            text: string;
        };
        DaysOld: {
            text: string;
        };
        SexType: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        OutHouseType: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        Quantity: {
            text: string;
            rangeMessage: string;
            requiredMessage: string;
            emptyMessage: string;
            patternMessage: string;
        };
        UnitWeight: {
            text: string;
            rangeMessage: string;
            patternMessage: string;
            emptyMessage: string;
        };
        PortionWeight: {
            text: string;
            rangeMessage: string;
            patternMessage: string;
        };
        Amount: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
            patternMessage: string;
        };
        UnitPriceTax: {
            text: string;
            patternMessage: string;
        };
        Remarks: {
            text: string;
        };
    };
    ZqDeathCull: {
        title: string;
        DataDate: {
            text: string;
            requiredMessage: string;
        };
        INChickenFarmID: {
            text: string;
            requiredMessage: string;
        };
        OUTChickenFarmID: {
            text: string;
            requiredMessage: string;
        };
        WarehouseID: {
            text: string;
            requiredMessage: string;
        };
        HenhouseID: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        BatchID: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        SexType: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        Quantity: {
            text: string;
            rangeMessage: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        DeathQuantity: {
            text: string;
            rangeMessage: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        SaleQuantity: {
            text: string;
            rangeMessage: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        CullQuantity: {
            text: string;
            rangeMessage: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        createPageTitle: string;
        editPageTitle: string;
    };
    ZqStockTaking: {
        title: string;
        DataDate: {
            text: string;
            requiredMessage: string;
        };
        WarehouseID: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        HenhouseID: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        BatchID: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        SexType: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        ProductName: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        ActualQuantity: {
            text: string;
            rangeMessage: string;
            requiredMessage: string;
            emptyMessage: string;
            patternMessage: string;
        };
        Quantity: {
            text: string;
            rangeMessage: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        DifferenceQuantity: {
            text: string;
            rangeMessage: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        Amount: {
            text: string;
            rangeMessage: string;
        };
        createPageTitle: string;
        editPageTitle: string;
    };
    ZqHenhouseSterilize: {
        title: string;
        emptytitle: string;
        DataDate: {
            text: string;
            requiredMessage: string;
        };
        WarehouseID: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        HenhouseID: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        PersonID: {
            text: string;
        };
        MarketID: {
            text: string;
        };
        ProductBatchID: {
            text: string;
        };
        MeasureUnit: {
            text: string;
        };
        SterilizeMethod: {
            text: string;
        };
        Dosage: {
            text: string;
        };
        RemarksDetail: {
            text: string;
        };
        ProductID: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        Quantity: {
            text: string;
            rangeMessage: string;
            requiredMessage: string;
            emptyMessage: string;
            patternMessage: string;
        };
        createPageTitle: string;
        editPageTitle: string;
        createPageEmptyTitle: string;
        editPageEmptyTitle: string;
    };
    ZqEnvironmentSterilize: {
        title: string;
        emptytitle: string;
        DataDate: {
            text: string;
            requiredMessage: string;
        };
        WarehouseID: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        PersonID: {
            text: string;
        };
        MarketID: {
            text: string;
        };
        ProductBatchID: {
            text: string;
        };
        MeasureUnit: {
            text: string;
        };
        SterilizeMethod: {
            text: string;
        };
        Dosage: {
            text: string;
        };
        RemarksDetail: {
            text: string;
        };
        ProductID: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        Quantity: {
            text: string;
            rangeMessage: string;
            requiredMessage: string;
            emptyMessage: string;
            patternMessage: string;
        };
        createPageTitle: string;
        editPageTitle: string;
        createPageEmptyTitle: string;
        editPageEmptyTitle: string;
    };
    ZqSortingEggsSetting: {
        SortingEggType: {
            SortingEggTypeA: string;
            SortingEggTypeB: string;
            SortingEggTypeC: string;
            SortingEggTypeD: string;
            SortingEggTypeE: string;
        };
        SortingEggID: {
            SortingEggIDA: string;
            SortingEggIDB: string;
            SortingEggIDC: string;
            SortingEggIDD: string;
            SortingEggIDE: string;
            SortingEggIDF: string;
            SortingEggIDG: string;
            SortingEggIDH: string;
            SortingEggIDI: string;
            SortingEggIDJ: string;
            SortingEggIDK: string;
        };
    };
    ZqLayEggsSetting: {
        title: string;
        LayEggCategoryName: string;
        listPageTitle: string;
        detailPageTitle: string;
        LayEggType: {
            LayEggTypeA: string;
            LayEggTypeB: string;
            LayEggTypeC: string;
        };
        LayEggID: {
            LayEggIDA: string;
            LayEggIDB: string;
            LayEggIDC: string;
            LayEggIDD: string;
            LayEggIDE: string;
            LayEggIDF: string;
            LayEggIDG: string;
            LayEggIDH: string;
        };
    };
    ZqRptTemplateSetting: {
        title: string;
        RptTempName: string;
        IsDefault: string;
        SourceName: string;
        LayEggCategoryName: string;
        LayEggType: {
            LayEggTypeA: string;
            LayEggTypeB: string;
            LayEggTypeC: string;
        };
        LayEggID: {
            LayEggIDA: string;
            LayEggIDB: string;
            LayEggIDC: string;
            LayEggIDD: string;
            LayEggIDE: string;
            LayEggIDF: string;
            LayEggIDG: string;
            LayEggIDH: string;
        };
    };
    SortingEggsSetting: {
        title: string;
        SrcProductName: string;
        listPageTitle: string;
        detailPageTitle: string;
        LayEggType: {
            LayEggTypeA: string;
            LayEggTypeB: string;
            LayEggTypeC: string;
        };
        LayEggID: {
            LayEggIDA: string;
            LayEggIDB: string;
            LayEggIDC: string;
            LayEggIDD: string;
            LayEggIDE: string;
            LayEggIDF: string;
            LayEggIDG: string;
            LayEggIDH: string;
        };
    };
    ZqEggsTransfer: {
        title: string;
        DataDate: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
            tipsMessage: string;
        };
        OutWarehouseID: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
            placeholder: string;
            tipsMessage: string;
        };
        OutMarketID: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
            placeholder: string;
        };
        InWarehouseID: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
            placeholder: string;
        };
        InMarketID: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
            placeholder: string;
        };
        TicketedPointID: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
            placeholder: string;
        };
        PersonID: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
            placeholder: string;
        };
        Status: {
            text: string;
            trueText: string;
            falseText: string;
        };
        createPageTitle: string;
        editPageTitle: string;
    };

    ZqEggsTransferDetail: {
        ProductID: {
            text: string;
        };
        ProductBatchID: {
            text: string;
        };
        MeasureUnitNameExt: {
            text: string;
        };
        QuantityExt: {
            text: string;
            patternMessage: string;
        };
        MeasureUnitName: {
            text: string;
        };
        Quantity: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
            patternMessage: string;
        };
        StatUnitName: {
            text: string;
        };
        StatQuantity: {
            text: string;
            patternMessage: string;
        };
        UnicumUnitName: {
            text: string;
        };
        UnicumQuantity: {
            text: string;
            patternMessage: string;
        };
        Remarks: {
            text: string;
        };
        FarmID: {
            text: string;
        };
        HenhouseID: {
            text: string;
        };
        BatchID: {
            text: string;
        };
        BreedingID: {
            text: string;
        };
        ProductionDate: {
            text: string;
        };
        DaysWeek: {
            text: string;
            patternMessage: string;
        };
        BatchRemarks: {
            text: string;
            patternMessage: string;
        };
    };
    ZqEggsToFarm: {
        title: string;
        DataDate: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
            tipsMessage: string;
        };
        OutWarehouseID: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
            placeholder: string;
            tipsMessage: string;
        };
        OutMarketID: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
            placeholder: string;
        };
        InWarehouseID: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
            placeholder: string;
        };
        InMarketID: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
            placeholder: string;
        };
        TicketedPointID: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
            placeholder: string;
        };
        PersonID: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
            placeholder: string;
        };
        Status: {
            text: string;
            trueText: string;
            falseText: string;
        };
        createPageTitle: string;
        editPageTitle: string;
    };
    ZqEggsToFarmDetail: {
        ProductID: {
            text: string;
        };
        ProductBatchID: {
            text: string;
        };
        MeasureUnitNameExt: {
            text: string;
        };
        QuantityExt: {
            text: string;
            patternMessage: string;
        };
        MeasureUnitName: {
            text: string;
        };
        Quantity: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
            patternMessage: string;
        };
        StatUnitName: {
            text: string;
        };
        StatQuantity: {
            text: string;
            patternMessage: string;
        };
        UnicumUnitName: {
            text: string;
        };
        UnicumQuantity: {
            text: string;
            patternMessage: string;
        };
        Remarks: {
            text: string;
        };
        FarmID: {
            text: string;
        };
        HenhouseID: {
            text: string;
        };
        BatchID: {
            text: string;
        };
        BreedingID: {
            text: string;
        };
        ProductionDate: {
            text: string;
        };
        DaysWeek: {
            text: string;
            patternMessage: string;
        };
        BatchRemarks: {
            text: string;
            patternMessage: string;
        };
    };

    ZqEggTesterSetting: {
        EggTesterType: {
            EggTesterTypeA: string;
            EggTesterTypeB: string;
            EggTesterTypeC: string;
        };
    };
    ZqIncubatorSetting: {
        Name: {
            text: string;
        };
        Type: {
            text: string;
        };
        ZoningID: {
            text: string;
        };
        Hatcher: {
            text: string;
        };
        create: string;
        edit: string;
        delete: string;
        createPageTitle: string;
        editPageTitle: string;
    };
    ZqEggTesterTraySetting: {
        EmbryoEggType: {
            EmbryoEggTypeA: string;
            EmbryoEggTypeB: string;
            EmbryoEggTypeC: string;
        };
        EmbryoEggID: {
            EmbryoEggIDA: string;
            EmbryoEggIDB: string;
            EmbryoEggIDC: string;
            EmbryoEggIDD: string;
            EmbryoEggIDE: string;
            EmbryoEggIDF: string;
            EmbryoEggIDG: string;
        };
    };

    egggoodspurchase: {
        title: string;
        DataDate: {
            text: string;
            requiredMessage: string;
        };
        CustomerID: {
            text: string;
            requiredMessage: string;
        };
        PurchaserID: {
            text: string;
        };
        MarketID: {
            text: string;
        };
        WarehouseID: {
            text: string;
            requiredMessage: string;
        };
        Abstract: {
            text: string;
            requiredMessage: string;
        };
        TicketedPointID: {
            text: string;
            requiredMessage: string;
        };
        FreightFor: {
            text: string;
            requiredMessage: string;
        };
        createPageTitle: string;
        editPageTitle: string;
    };
    EggGoodsPurchaseDetail: {
        ProductID: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        Specification: {
            text: string;
        };
        ProductBatchID: {
            text: string;
        };
        MeasureUnitExt: {
            text: string;
        };
        QuantityExt: {
            text: string;
            patternMessage: string;
        };
        TaxPriceExt: {
            text: string;
            patternMessage: string;
        };
        MeasureUnitName: {
            text: string;
        };
        Quantity: {
            text: string;
            requiredMessage: string;
            patternMessage: string;
        };
        TaxPrice: {
            text: string;
            patternMessage: string;
        };
        Amount: {
            text: string;
            patternMessage: string;
        };
        StatUnit: {
            text: string;
        };
        StatQuantity: {
            text: string;
            patternMessage: string;
        };
        UnicumUnit: {
            text: string;
        };
        UnicumQuantity: {
            text: string;
            patternMessage: string;
        };
        TaxRate: {
            text: string;
            patternMessage: string;
        };
        Gift: {
            text: string;
        };
        Remarks: {
            text: string;
        };
        ChickenFarmID: {
            text: string;
        };
        HenhouseID: {
            text: string;
        };
        BatchID: {
            text: string;
        };
        ProductionDate: {
            text: string;
        };
        BreedingID: {
            text: string;
        };
        DaysWeek: {
            text: string;
            patternMessage: string;
        };
        BatchRemarks: {
            text: string;
        };
    };

    ZqBrood: {
        title: string;
        DataDate: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
            tipsMessage: string;
        };
        BatchID: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
            placeholder: string;
        };
        EggTesterType: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        WarehouseID: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
            placeholder: string;
            tipsMessage: string;
        };
        FirstEggTesterDate: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        ShiftTrayDate: {
            text: string;
        };
        HatcheDate: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        TotalQuantity: {
            text: string;
        };
        TestedQuantity: {
            text: string;
        };
        EggtesterStatus: {
            text: string;
        };
        Status: {
            text: string;
            trueText: string;
            falseText: string;
        };
        createPageTitle: string;
        editPageTitle: string;
        createPageTitle2: string;
        editPageTitle2: string;
    };

    ZqBroodDetail: {
        IncubatorID: {
            text: string;
        };
        BreedingEggSource: {
            text: string;
        };
        ProductID: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        ProductBatchID: {
            text: string;
        };
        MeasureUnitNameExt: {
            text: string;
        };
        QuantityExt: {
            text: string;
            patternMessage: string;
        };
        MeasureUnitName: {
            text: string;
        };
        Quantity: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
            patternMessage: string;
        };
        UnitPrice: {
            text: string;
            patternMessage: string;
        };
        Amount: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
            patternMessage: string;
        };
        Remarks: {
            text: string;
        };
        FarmID: {
            text: string;
        };
        HenhouseID: {
            text: string;
        };
        BatchID: {
            text: string;
        };
        BreedingID: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        DaysWeek: {
            text: string;
            patternMessage: string;
        };
        NestlingSpec: {
            text: string;
        };
        LivingEmbryoRate: {
            text: string;
            patternMessage: string;
        };
        HealthyChicksRate: {
            text: string;
            patternMessage: string;
        };
        NumericalOrderRelated: {
            text: string;
        };
    };
    ZqEggTesterTray: {
        title: string;
        DataDate: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        BatchID: {
            text: string;
            placeholder: string;
        };
        reShineID: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
            placeholder: string;
        };
        EggTesterType: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        ByProdWarehouseID: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
            placeholder: string;
        };
        EmbryoWarehouseID: {
            text: string;
            requiredMessage: string;
            placeholder: string;
        };
        NumericalOrderSource: {
            text: string;
        };
        HatcheDate: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        NumericalOrderRelated: {
            text: string;
        };
        IsShiftTray: {
            text: string;
            requiredMessage: string;
            trueText: string;
            falseText: string;
        };
        Status: {
            text: string;
            trueText: string;
            falseText: string;
        };
        againPageTitle: string;
        editPageTitle: string;
    };

    ZqEggTesterTrayDetail: {
        SerialNo: {
            text: string;
        };
        IncubatorID: {
            text: string;
        };
        BroodQuantity: {
            text: string;
        };
        ProductID: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        EggTesterQuantity: {
            text: string;
            patternMessage: string;
        };
        InfertileEgg: {
            text: string;
            patternMessage: string;
        };
        DeadEmbryoEgg: {
            text: string;
            patternMessage: string;
        };
        AddledEgg: {
            text: string;
            patternMessage: string;
        };
        ExuviaeEgg: {
            text: string;
            patternMessage: string;
        };
        BrokenEgg: {
            text: string;
            patternMessage: string;
        };
        StockEmbryoEgg: {
            text: string;
            patternMessage: string;
        };
        HatcheringEmbryoEgg: {
            text: string;
            patternMessage: string;
        };
        HatcherID: {
            text: string;
        };
        Remarks: {
            text: string;
        };
        FarmID: {
            text: string;
        };
        HenhouseID: {
            text: string;
        };
        BatchID: {
            text: string;
        };
        BreedingID: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        DaysWeek: {
            text: string;
            patternMessage: string;
        };
        NestlingSpec: {
            text: string;
        };
        HealthyChicksRate: {
            text: string;
            patternMessage: string;
        };
        NumericalOrderPickupChick: {
            text: string;
        };
    };
    ZqEggTesterTrayRelist: {
        title: string;
        DataDate: {
            text: string;
        };
        Number: {
            text: string;
        };
        BatchID: {
            text: string;
        };
        NumericalOrderSource: {
            text: string;
        };
        HatcheDate: {
            text: string;
        };
        IncubatorID: {
            text: string;
        };
        Remarks: {
            text: string;
        };
    };
    ZqPickupChick: {
        title: string;
        DataDate: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        BatchID: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };

        ByProdWarehouseID: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
            placeholder: string;
        };
        Status: {
            text: string;
            trueText: string;
            falseText: string;
        };
        againPageTitle: string;
        editPageTitle: string;
    };
    ZqPickupChickDetail: {
        SerialNo: {
            text: string;
        };
        IncubatorID: {
            text: string;
        };
        BroodQuantity: {
            text: string;
            patternMessage: string;
        };
        ProductID: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        LiveEmbryoQuantity: {
            text: string;
            patternMessage: string;
        };
        ChickQuantity: {
            text: string;
            patternMessage: string;
        };
        WetChickQuantity: {
            text: string;
            patternMessage: string;
        };
        ImperfectQuantity: {
            text: string;
            patternMessage: string;
        };
        DeadChickQuantity: {
            text: string;
            patternMessage: string;
        };
        BalutQuantity: {
            text: string;
            patternMessage: string;
        };
        LossQuantity: {
            text: string;
            patternMessage: string;
        };
        HatcherID: {
            text: string;
        };
        Remarks: {
            text: string;
        };
        FarmID: {
            text: string;
        };
        HenhouseID: {
            text: string;
        };
        BatchID: {
            text: string;
        };
        BreedingID: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        DaysWeek: {
            text: string;
            patternMessage: string;
        };
        NestlingSpec: {
            text: string;
        };
    };
    ZqChickIntoStock: {
        title: string;
        DataDate: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        WarehouseID: {
            text: string;
            placeholder: string;
        };
        Status: {
            text: string;
            trueText: string;
            falseText: string;
        };
        createPageTitle: string;
        editPageTitle: string;
    };
    ZqChickIntoStockDetail: {
        HatcherID: {
            text: string;
        };
        HatchBatchID: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        ProductID: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        Packages: {
            text: string;
            patternMessage: string;
        };
        ValueQuantity: {
            text: string;
            patternMessage: string;
        };
        DonateQuantity: {
            text: string;
            patternMessage: string;
        };
        TotalQuantity: {
            text: string;
            patternMessage: string;
        };
        Remarks: {
            text: string;
        };
        BroodProductID: {
            text: string;
        };
        FarmID: {
            text: string;
        };
        HenhouseID: {
            text: string;
        };
        BatchID: {
            text: string;
        };
        BreedingID: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        DaysWeek: {
            text: string;
            patternMessage: string;
        };
        Debeaking: {
            text: string;
        };
        ImmuneSubjectID: {
            text: string;
        };
        ProductBatchID: {
            text: string;
        };
        MeasureUnitName: {
            text: string;
        };
        MeasureUnitNameExt: {
            text: string;
        };
    };
    ZqBatchRule: {
        title: string;
        BatchRuleName: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        MnemonicCode: {
            text: string;
        };
        BatchSubjectID: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        Remarks: {
            text: string;
        };
        createPageTitle: string;
        editPageTitle: string;
    };
    EggGoodsSalesOrder: {
        title: string;
        Number: {
            text: string;
        };
        DataDate: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
            tipsMessage: string;
        };
        CreatedOwnerName: {
            text: string;
        };
        WarehouseID: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
            placeholder: string;
            tipsMessage: string;
        };
        MarketID: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
            placeholder: string;
        };
        receipt: {
            text: string;
        };
        Amount: {
            text: string;
            patternMessage: string;
        };
        CustomerID: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
            placeholder: string;
        };
        SubCustomerID: {
            text: string;
            placeholder: string;
        };
        SalesManID: {
            text: string;
            placeholder: string;
        };
        Abstract: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
            placeholder: string;
        };
        TicketedPointID: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
            placeholder: string;
        };
        createPageTitle: string;
        editPageTitle: string;
    };
    EggGoodsSalesOrderDetail: {
        ProductID: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        Specification: {
            text: string;
        };
        ProductBatchID: {
            text: string;
        };
        MeasureUnitNameExt: {
            text: string;
        };
        QuantityExt: {
            text: string;
            patternMessage: string;
        };
        TaxPriceExt: {
            text: string;
            patternMessage: string;
        };
        MeasureUnitName: {
            text: string;
        };
        Quantity: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
            patternMessage: string;
        };
        TaxPrice: {
            text: string;
            patternMessage: string;
        };
        Amount: {
            text: string;
            patternMessage: string;
        };
        StatUnitName: {
            text: string;
        };
        StatQuantity: {
            text: string;
            patternMessage: string;
        };
        UnicumUnitName: {
            text: string;
        };
        UnicumQuantity: {
            text: string;
            patternMessage: string;
        };
        TaxRate: {
            text: string;
            patternMessage: string;
        };
        Gift: {
            text: string;
        };
        Remarks: {
            text: string;
        };
        ChickenFarmID: {
            text: string;
        };
        HenhouseID: {
            text: string;
        };
        BatchID: {
            text: string;
        };
        BreedingID: {
            text: string;
        };
        ProductionDate: {
            text: string;
        };
        DaysWeek: {
            text: string;
            patternMessage: string;
        };
    };
    ZqChickSales: {
        title: string;
        Number: {
            text: string;
        };
        HatcheryFarmName: {
            text: string;
        };
        DataDate: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
            tipsMessage: string;
        };
        CreatedOwnerName: {
            text: string;
        };
        WarehouseID: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
            placeholder: string;
            tipsMessage: string;
        };
        HatcheryFarmID: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
            placeholder: string;
        };
        MarketID: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
            placeholder: string;
        };
        receipt: {
            text: string;
        };
        Amount: {
            text: string;
            patternMessage: string;
        };
        CustomerID: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
            placeholder: string;
        };
        SalesManID: {
            text: string;
            placeholder: string;
        };
        Abstract: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
            placeholder: string;
        };
        createPageTitle: string;
        editPageTitle: string;
    };
    ZqChickSalesDetail: {
        ProductID: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        ProductBatchID: {
            text: string;
        };
        MeasureUnitNameExt: {
            text: string;
        };
        QuantityExt: {
            text: string;
            patternMessage: string;
        };
        MeasureUnitName: {
            text: string;
        };
        Quantity: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
            patternMessage: string;
        };
        TaxPrice: {
            text: string;
            patternMessage: string;
        };
        Amount: {
            text: string;
            patternMessage: string;
        };
        DonateQuantity: {
            text: string;
            patternMessage: string;
        };
        TotalQuantity: {
            text: string;
            patternMessage: string;
        };
        SexType: {
            text: string;
        };
        HatchBatchID: {
            text: string;
        };
        HatcherID: {
            text: string;
        };
        Remarks: {
            text: string;
        };
        Debeaking: {
            text: string;
        };
        ImmuneSubjectID: {
            text: string;
            emptyMessage: string;
        };
        FarmID: {
            text: string;
        };
        HenhouseID: {
            text: string;
        };
        BatchID: {
            text: string;
        };
        BreedingID: {
            text: string;
        };
        DaysWeek: {
            text: string;
            patternMessage: string;
        };
    };
    ZqEggsSignFor: {
        title: string;
        Number: {
            text: string;
        };
        DataDate: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
            tipsMessage: string;
        };
        CreatedOwnerName: {
            text: string;
        };
        WarehouseID: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
            placeholder: string;
            tipsMessage: string;
        };
        MarketID: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
            placeholder: string;
        };
        receipt: {
            text: string;
        };
        Amount: {
            text: string;
            patternMessage: string;
        };
        CustomerID: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
            placeholder: string;
        };
        SubCustomerID: {
            text: string;
            placeholder: string;
        };
        SalesManID: {
            text: string;
            placeholder: string;
        };
        Abstract: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
            placeholder: string;
        };
        TicketedPointID: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
            placeholder: string;
        };
        createPageTitle: string;
        editPageTitle: string;
    };
    ZqEggsSignForDetail: {
        ProductID: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        Specification: {
            text: string;
        };
        ProductBatchID: {
            text: string;
        };
        MeasureUnitNameExt: {
            text: string;
        };
        QuantityExt: {
            text: string;
            patternMessage: string;
        };
        TaxPriceExt: {
            text: string;
            patternMessage: string;
        };
        MeasureUnitName: {
            text: string;
        };
        Quantity: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
            patternMessage: string;
        };
        TaxPrice: {
            text: string;
            patternMessage: string;
        };
        Amount: {
            text: string;
            patternMessage: string;
        };
        StatUnitName: {
            text: string;
        };
        StatQuantity: {
            text: string;
            patternMessage: string;
        };
        UnicumUnitName: {
            text: string;
        };
        UnicumQuantity: {
            text: string;
            patternMessage: string;
        };
        TaxRate: {
            text: string;
            patternMessage: string;
        };
        Gift: {
            text: string;
        };
        Remarks: {
            text: string;
        };
        ChickenFarmID: {
            text: string;
        };
        HenhouseID: {
            text: string;
        };
        BatchID: {
            text: string;
        };
        BreedingID: {
            text: string;
        };
        ProductionDate: {
            text: string;
        };
        DaysWeek: {
            text: string;
            patternMessage: string;
        };
    };
    ZqBioSafety: {
        title: string;
        DataDate: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        BatchID: {
            text: string;
            placeholder: string;
            requiredMessage: string;
            emptyMessage: string;
        };

        WarehouseID: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
            placeholder: string;
        };
        Status: {
            text: string;
            trueText: string;
            falseText: string;
        };
        againPageTitle: string;
        editPageTitle: string;
    };
    ZqBioSafetyDetail: {
        SerialNo: {
            text: string;
        };
        IncubatorID: {
            text: string;
        };
        BroodQuantity: {
            text: string;
            patternMessage: string;
        };
        ProductID: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        MeasureUnitName: {
            text: string;
            patternMessage: string;
        };
        MarketID: {
            text: string;
            patternMessage: string;
        };
        PersonID: {
            text: string;
            patternMessage: string;
        };
        BillType: {
            text: string;
            patternMessage: string;
            emptyMessage: string;
        };
        BalutQuantity: {
            text: string;
            patternMessage: string;
        };
        TotalQuantity: {
            text: string;
            patternMessage: string;
            emptyMessage: string;
        };
        HatcherID: {
            text: string;
        };
        Remarks: {
            text: string;
        };
        FarmID: {
            text: string;
        };
        HenhouseID: {
            text: string;
        };
        BatchID: {
            text: string;
        };
        SexType: {
            text: string;
        };
        ProductBatchID: {
            text: string;
        };
        measureUnit: {
            text: string;
        };
        Quantity: {
            text: string;
            patternMessage: string;
        };
        BreedingID: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        OperationMode: {
            text: string;
            patternMessage: string;
        };
        NestlingSpec: {
            text: string;
        };
    };
    ZqBatchImmuneProcess: {
        title: string;
        ProcessName: {
            text: string;
        };
        DataDate: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        BatchID: {
            text: string;
            placeholder: string;
            requiredMessage: string;
            emptyMessage: string;
        };

        WarehouseID: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
            placeholder: string;
        };
        Status: {
            text: string;
            trueText: string;
            falseText: string;
        };
        againPageTitle: string;
        editPageTitle: string;
    };
    ZqBatchImmuneProcessDetail: {
        SerialNo: {
            text: string;
        };
        PlanImmuneDate: {
            text: string;
        };
        ProcessRemarks: {
            text: string;
        };
        blImmunity: {
            text: string;
        };
        RealImmuneDate: {
            text: string;
        };
        IncubatorID: {
            text: string;
        };
        BroodQuantity: {
            text: string;
            patternMessage: string;
        };
        NumericalOrderProcess: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        MeasureUnitName: {
            text: string;
            patternMessage: string;
        };
        MarketID: {
            text: string;
            patternMessage: string;
        };
        PersonID: {
            text: string;
            patternMessage: string;
        };
        BillType: {
            text: string;
            patternMessage: string;
            emptyMessage: string;
        };
        BalutQuantity: {
            text: string;
            patternMessage: string;
        };
        TotalQuantity: {
            text: string;
            patternMessage: string;
            emptyMessage: string;
        };
        HatcherID: {
            text: string;
        };
        Remarks: {
            text: string;
        };
        FarmID: {
            text: string;
        };
        HenhouseID: {
            text: string;
        };
        BatchID: {
            text: string;
        };
        SexType: {
            text: string;
        };
        ProductBatchID: {
            text: string;
        };
        measureUnit: {
            text: string;
        };
        Quantity: {
            text: string;
            patternMessage: string;
        };
        BreedingID: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        OperationMode: {
            text: string;
            patternMessage: string;
        };
        NestlingSpec: {
            text: string;
        };
    };
    DpMonthDataSummary: {
        title: string;
        EnterpriseId: {
            text: string;
            required: string;
        };
        CreatedDate: {
            text: string;
        };
        CreateType: {
            text: string;
        };
        OwnerName: {
            text: string;
        };
        ChickenFarmName: {
            text: string;
        };
        Number: {
            text: string;
        };
        DataDate: {
            text: string;
        };
        calculation: {
            text: string;
        };
        HenhouseID: {
            text: string;
            required: string;
        };
        BatchID: {
            text: string;
            required: string;
        };
        BatchType: {
            text: string;
            required: string;
        };
        Quantity: {
            text: string;
            required: string;
        };
        EffectMonth: {
            text: string;
            required: string;
        };
        OriginalValue: {
            text: string;
            required: string;
        };
        DescentLine: {
            text: string;
            required: string;
        };
        Amount: {
            text: string;
            required: string;
        };
        SexType: {
            text: string;
            required: string;
        };
        DepreciationMonthAmount: {
            text: string;
            required: string;
        };
        DepreciationAccumulated: {
            text: string;
            required: string;
        };
        NetValue: {
            text: string;
            required: string;
        };

        createPageTitle: string;
        editPageTitle: string;
    };
    productPackageSet: {
        title: string;
        StockType: {
            text: string;
        };
        StockName: {
            text: string;
        };
        ClassificationID: {
            text: string;
        };
        ClassificationName: {
            text: string;
        };
        Package: {
            text: string;
        };
        Products: {
            text: string;
        };
        ProgramName: {
            text: string;
        };
        DataDate: {
            text: string;
        };
        Number: {
            text: string;
        };
        EnterpriseID: {
            text: string;
        };
        OwnerID: {
            text: string;
        };
        CreatedOwnerID: {
            text: string;
        };
        CreatedOwnerName: {
            text: string;
        };
        OwnerName: {
            text: string;
        };
        DaysOld: {
            text: string;
        };
        BreedStandardID: {
            text: string;
        };
        GenerationLine: {
            text: string;
        };
        StrainLineID: {
            text: string;
        };
        BreedingID: {
            text: string;
        };
        DescentLine: {
            text: string;
        };
        BatchType: {
            text: string;
        };
        ProductID: {
            text: string;
        };
        PostBreedingID: {
            text: string;
        };
        IsUse: {
            text: string;
        };
        CreatedDate: {
            text: string;
        };
        ModifiedDate: {
            text: string;
        };
        Remarks: {
            text: string;
        };
        createPageTitle: string;
        editPageTitle: string;
    };
    ProductPackageSetDetail: {
        Quantity: {
            text: string;
            required: string;
        };
        ProductName: {
            text: string;
        };
        MeasureUnit: {
            text: string;
        };
        DetailRemarks: {
            text: string;
        };
    };
    ProductionSegmentation: {
        title: string;
        DataDate: {
            text: string;
            requiredMessage: string;
        };
        WarehouseStockType: {
            text: string;
            requiredMessage: string;
        };
        OutWarehouseName: {
            text: string;
            requiredMessage: string;
        };
        OutQuantity: {
            text: string;
            requiredMessage: string;
        };
        OutWarehouseName2: {
            text: string;
            requiredMessage: string;
        };
        OutQuantity2: {
            text: string;
            requiredMessage: string;
        };
        InWarehouseName: {
            text: string;
            requiredMessage: string;
        };
        InQuantity: {
            text: string;
            requiredMessage: string;
        };
        createPageTitle: string;
        editPageTitle: string;
    };
    ZqImmuneProcess: {
        createPageTitle: string;
        editPageTitle: string;
        title: string;
        ProcessName: {
            text: string;
            required: string;
        };
        Number: {
            text: string;
        };
        DataDate: {
            text: string;
        };
        CheckedByID: {
            text: string;
        };
        AuditDate: {
            text: string;
        };
        ChickenFarmID: {
            text: string;
        };
        ComboPack: {
            text: string;
        };
        GroupID: {
            text: string;
        };
        EnterpriseID: {
            text: string;
        };
        CreatedDate: {
            text: string;
        };
        CreatedOwnerID: {
            text: string;
        };
        ModifiedDate: {
            text: string;
        };
        OwnerID: {
            text: string;
        };
        NumericalOrder: {
            text: string;
        };
        Remarks: {
            text: string;
        };
    };
    ZqImmuneProcessDetail: {
        Title: string;
        createPageTitle: string;
        editPageTitle: string;
        ProcessNo: {
            text: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        DaysOld: {
            text: string;
            patternMessage: string;
        };
        DaysWeek: {
            text: string;
            patternMessage: string;
        };
        ImmuneSubjectID: {
            text: string;
            emptyMessage: string;
        };
        ProductCommonName: {
            text: string;
            emptyMessage: string;
        };
        DosageForm: {
            text: string;
            emptyMessage: string;
        };
        Quantity: {
            text: string;
            emptyMessage: string;
        };
        DosageUnitName: {
            text: string;
            emptyMessage: string;
        };
        ImmuneType: {
            text: string;
            emptyMessage: string;
        };
        Vendor: {
            text: string;
        };
    };
    YHFarmerContract: {
        editPageTitle: string;
        createPageTitle: string;
        NumericalOrder: {
            text: string;
            emptyMessage: string;
        };
        YHFarmerID: {
            text: string;
            emptyMessage: string;
        };
        DataDate: {
            text: string;
            emptyMessage: string;
        };
        BeginDate: {
            text: string;
            emptyMessage: string;
        };
        EndDate: {
            text: string;
            emptyMessage: string;
        };
        ContractNo: {
            text: string;
            emptyMessage: string;
        };
        ChickAbstract: {
            text: string;
            emptyMessage: string;
        };
        FeedAbstract: {
            text: string;
            emptyMessage: string;
        };
        DrugAbstract: {
            text: string;
            emptyMessage: string;
        };
        ChickenFarmID: {
            text: string;
            emptyMessage: string;
        };
        EnterpriseID: {
            text: string;
            emptyMessage: string;
        };
        ComboPack: {
            text: string;
            emptyMessage: string;
        };
        GroupID: {
            text: string;
            emptyMessage: string;
        };
        Remarks: {
            text: string;
            emptyMessage: string;
        };
        OwnerID: {
            text: string;
            emptyMessage: string;
        };
        CreatedOwnerID: {
            text: string;
            emptyMessage: string;
        };
        CreatedOwnerName: {
            text: string;
            emptyMessage: string;
        };
        OwnerName: {
            text: string;
            emptyMessage: string;
        };
        CreatedDate: {
            text: string;
            emptyMessage: string;
        };
        ModifiedDate: {
            text: string;
            emptyMessage: string;
        };
        CheckedByID: {
            text: string;
            emptyMessage: string;
        };
        AuditDate: {
            text: string;
            emptyMessage: string;
        };
        AuditName: {
            text: string;
            emptyMessage: string;
        };
        YHFarmerName: {
            text: string;
            emptyMessage: string;
        };
        ConcertPerson: {
            text: string;
            emptyMessage: string;
        };
    };
    YHFarmerContractHenhouseDetail: {
        NumericalOrder: {
            text: string;
            emptyMessage: string;
        };
        NumericalOrderDetail: {
            text: string;
            emptyMessage: string;
        };
        HenhouseID: {
            text: string;
            emptyMessage: string;
        };
        ChickenFarmID: {
            text: string;
            emptyMessage: string;
        };
        ZoningID: {
            text: string;
            emptyMessage: string;
        };
        EnterpriseID: {
            text: string;
            emptyMessage: string;
        };
        Remarks: {
            text: string;
            emptyMessage: string;
        };
        YHFarmerID: {
            text: string;
            emptyMessage: string;
        };
        DataDate: {
            text: string;
            emptyMessage: string;
        };
        StartDate: {
            text: string;
            emptyMessage: string;
        };
        EndDate: {
            text: string;
            emptyMessage: string;
        };
        ContractNo: {
            text: string;
            emptyMessage: string;
        };
        ChickAbstract: {
            text: string;
            emptyMessage: string;
        };
        FeedAbstract: {
            text: string;
            emptyMessage: string;
        };
        DrugAbstract: {
            text: string;
            emptyMessage: string;
        };
        ComboPack: {
            text: string;
            emptyMessage: string;
        };
        GroupID: {
            text: string;
            emptyMessage: string;
        };
        OwnerID: {
            text: string;
            emptyMessage: string;
        };
        CreatedOwnerID: {
            text: string;
            emptyMessage: string;
        };
        CreatedOwnerName: {
            text: string;
            emptyMessage: string;
        };
        OwnerName: {
            text: string;
            emptyMessage: string;
        };
        CreatedDate: {
            text: string;
            emptyMessage: string;
        };
        ModifiedDate: {
            text: string;
            emptyMessage: string;
        };
        CheckedByID: {
            text: string;
            emptyMessage: string;
        };
        AuditDate: {
            text: string;
            emptyMessage: string;
        };
        AuditName: {
            text: string;
            emptyMessage: string;
        };
        AreaSize: {
            text: string;
            emptyMessage: string;
        };
        iCount: {
            text: string;
            emptyMessage: string;
        };
        AreaID: {
            text: string;
            emptyMessage: string;
        };
        FullAddress: {
            text: string;
            emptyMessage: string;
        };
    };
    YHBatch: {
        createPageTitle: string;
        editPageTitle: string;
        Status: {
            text: string;
        };
        YHBatchID: {
            text: string;
        };
        YHBatchName: {
            text: string;
        };
        DataDate: {
            text: string;
        };
        BreedingID: {
            text: string;
        };
        BreedingName: {
            text: string;
        };
        ProductID: {
            text: string;
        };
        ProductName: {
            text: string;
        };
        ChickenType: {
            text: string;
        };
        ChickSourceType: {
            text: string;
        };
        ChickSource: {
            text: string;
        };
        DaysOldDate: {
            text: string;
        };
        SerialNo: {
            text: string;
        };
        OneMedicineFee: {
            text: string;
        };
        IsTransfer: {
            text: string;
        };
        DaysOld: {
            text: string;
        };
        YHFarmerID: {
            text: string;
        };
        YHFarmerName: {
            text: string;
        };
        YHFarmerContract: {
            text: string;
        };
        ChickenFarmID: {
            text: string;
        };
        ChickenFarmName: {
            text: string;
        };
        EnterpriseID: {
            text: string;
        };
        GroupID: {
            text: string;
        };
        ComboPack: {
            text: string;
        };
        OwnerID: {
            text: string;
        };
        OwnerName: {
            text: string;
        };
        CreatedOwnerID: {
            text: string;
        };
        CreatedOwnerName: {
            text: string;
        };
        CreatedDate: {
            text: string;
        };
        ModifiedDate: {
            text: string;
        };
        Remarks: {
            text: string;
        };
    };
    DrugOtherReceive: {
        title: string;
        DataDate: {
            text: string;
            requiredMessage: string;
        };
        YHFarmerID: {
            text: string;
            requiredMessage: string;
        };
        YHBatch: {
            text: string;
            requiredMessage: string;
        };
        Abstract: {
            text: string;
            requiredMessage: string;
        };
        OutWarehouse: {
            text: string;
            requiredMessage: string;
        };
        InWarehouse: {
            text: string;
            requiredMessage: string;
        };
        ReceiveType: {
            text: string;
            requiredMessage: string;
        };
        ChickenFarmID: {
            text: string;
            requiredMessage: string;
        };
        isbegin: {
            text: string;
        };
        ConfirmStatus: {
            text: string;
            requiredMessage: string;
        };
        Number: {
            text: string;
        };
        createPageTitle: string;
        editPageTitle: string;
    };
    DrugOtherReceiveDetail: {
        ProductName: {
            text: string;
            required: string;
        };
        CommonName: {
            text: string;
            required: string;
        };
        Specification: {
            text: string;
        };
        bIsStandardPack: {
            text: string;
        };
        StandardPack: {
            text: string;
        };
        ProductBatchID: {
            text: string;
        };
        ProductValidity: {
            text: string;
        };
        ProductionDate: {
            text: string;
        };
        ValidDate: {
            text: string;
        };
        Packages: {
            text: string;
            required: string;
            message: string;
            patternMessage: string;
        };
        Quantity: {
            text: string;
            required: string;
            message: string;
            patternMessage: string;
        };
        MeasureUnitName: {
            text: string;
            required: string;
        };

        AmountTotal: {
            text: string;
            required: string;
            message: string;
            patternMessage: string;
        };
        UnitPrice: {
            text: string;
            required: string;
            message: string;
            patternMessage: string;
        };
        Gift: {
            text: string;
        };
        HenhouseID: {
            text: string;
            required: string;
        };
        addPageTitle: string;
        returnPageTitle: string;
    };
    YHPoultrySales: {
        editPageTitle: string;
        createPageTitle: string;
        title: string;
        NumericalOrder: {
            text: string;
        };
        Number: {
            text: string;
        };
        DataDate: {
            text: string;
            requiredMessage: string;
        };
        CustomerID: {
            text: string;
            requiredMessage: string;
        };
        ReqDeliveryDate: {
            text: string;
            requiredMessage: string;
        };
        SalesManID: {
            text: string;
        };
        MarketID: {
            text: string;
            requiredMessage: string;
        };
        SalesPeriod: {
            text: string;
        };
        Status: {
            text: string;
        };
        ChickenFarmID: {
            text: string;
        };
        GroupID: {
            text: string;
        };
        EnterpriseID: {
            text: string;
        };
        OwnerID: {
            text: string;
        };
        CreatedOwnerID: {
            text: string;
        };
        CreatedDate: {
            text: string;
        };
        ModifiedDate: {
            text: string;
        };
        Remarks: {
            text: string;
        };
    };
    YHPoultrySalesDetail: {
        NumericalOrderDetail: {
            text: string;
        };
        GUID: {
            text: string;
        };
        SerialNo: {
            text: string;
        };
        ProductID: {
            text: string;
            emptyMessage: string;
        };
        SexType: {
            text: string;
        };
        PoultrySalesRank: {
            text: string;
        };
        BreedingID: {
            text: string;
        };
        Quantity: {
            text: string;
            emptyMessage: string;
            patternMessage: string;
        };
        MeasureUnitName: {
            text: string;
        };
        UnitPrice: {
            text: string;
            emptyMessage: string;
            patternMessage: string;
        };
        Remarks: {
            text: string;
        };
    };
    YHClearHouse: {
        editPageTitle: string;
        createPageTitle: string;
        title: string;
        NumericalOrder: {
            text: string;
        };
        NumericalOrderExpend: {
            text: string;
        };
        Number: {
            text: string;
        };
        DataDate: {
            text: string;
        };
        YHFarmerID: {
            text: string;
        };
        YHBatch: {
            text: string;
        };
        BreedingID: {
            text: string;
        };
        ChickenFarmID: {
            text: string;
        };
        WarehouseID: {
            text: string;
        };
        ComboPack: {
            text: string;
        };
        GroupID: {
            text: string;
        };
        EnterpriseID: {
            text: string;
        };
        OwnerID: {
            text: string;
        };
        CreatedOwnerID: {
            text: string;
        };
        CreatedDate: {
            text: string;
        };
        ModifiedDate: {
            text: string;
        };
        Remarks: {
            text: string;
        };
        CheckedByName: {
            text: string;
        };
        CheckedDate: {
            text: string;
        };
    };
    YHClearHouseDetail: {
        NumericalOrderDetail: {
            text: string;
        };
        GUID: {
            text: string;
        };
        HenhouseID: {
            text: string;
            emptyMessage: string;
        };
        CounterQuantity: {
            text: string;
            emptyMessage: string;
        };
        UnknownQuantity: {
            text: string;
            emptyMessage: string;
        };
        DeathCullOuter: {
            text: string;
            emptyMessage: string;
        };
        WeedOuter: {
            text: string;
            emptyMessage: string;
        };
        ReceiveQuantity: {
            text: string;
        };
        RegDeathCullQuantity: {
            text: string;
        };
        RegWeedOutQuantity: {
            text: string;
        };
        RollOutQuantity: {
            text: string;
        };
        RollInQuantity: {
            text: string;
        };
        TransferSurplus: {
            text: string;
        };
        TransferLoss: {
            text: string;
        };
        DeadQuantity: {
            text: string;
        };
        Quantity: {
            text: string;
        };
        Remarks: {
            text: string;
        };
    };
    YHCashDeposit: {
        title: string;
        DataDate: {
            text: string;
            requiredMessage: string;
        };
        NumericalOrder: {
            text: string;
        };
        Number: {
            text: string;
        };
        YHFarmerID: {
            text: string;
            placeholder: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        AccountType: {
            text: string;
            placeholder: string;
            requiredMessage: string;
            emptyMessage: string;
        };
        QuoteBillType: {
            text: string;
            placeholder: string;
        };
        QuoteNumericalOrder: {
            text: string;
            placeholder: string;
        };
        Amount: {
            text: string;
            rangeMessage: string;
            patternMessage: string;
        };
        createPageTitle: string;
        editPageTitle: string;
    };
    YHOutHouseRecycle: {
        createPageTitle: string;
        editPageTitle: string;
        title: string;
        NumericalOrder: {
            text: string;
        };
        NumericalOrderExpand: {
            text: string;
        };
        Number: {
            text: string;
        };
        DataDate: {
            text: string;
        };
        InWarehouse: {
            text: string;
        };
        OutWarehouse: {
            text: string;
        };
        YHFarmerID: {
            text: string;
        };
        YHBatch: {
            text: string;
        };
        Abstract: {
            text: string;
        };
        QuoteNumber: {
            text: string;
        };
        QuoteNumericalOrderDetail: {
            text: string;
        };
        ChickenFarmID: {
            text: string;
        };
        ComboPack: {
            text: string;
        };
        GroupID: {
            text: string;
        };
        EnterpriseID: {
            text: string;
        };
        OwnerID: {
            text: string;
        };
        CreatedOwnerID: {
            text: string;
        };
        CreatedDate: {
            text: string;
        };
        ModifiedDate: {
            text: string;
        };
        Remarks: {
            text: string;
        };
        DaysOld: {
            text: string;
        };
    };
    YHOutHouseRecycleDetail: {
        NumericalOrderDetail: {
            text: string;
        };
        Guid: {
            text: string;
        };
        ProductID: {
            text: string;
            emptyMessage: string;
        };
        CageQuantity: {
            text: string;
        };
        ElementQuantity: {
            text: string;
            emptyMessage: string;
        };
        GrossWeight: {
            text: string;
        };
        BareWeight: {
            text: string;
        };
        VehicleWeight: {
            text: string;
        };
        NetWeight: {
            text: string;
        };
        Quantity: {
            text: string;
        };
        AverageWeight: {
            text: string;
        };
        MeasureUnit: {
            text: string;
        };
        ProposalUnit: {
            text: string;
        };
        UnitPrice: {
            text: string;
        };
        Amount: {
            text: string;
        };
        HenhouseID: {
            text: string;
            emptyMessage: string;
        };
        TaxRate: {
            text: string;
        };
        Remarks: {
            text: string;
        };
    };
    yhsettlementSetting: {
        DataDate: {
            text: string;
        };
        FarmingPriceID: {
            text: string;
        };
        Number: {
            text: string;
        };
        AccountMonth: {
            text: string;
        };
        YhName: {
            text: string;
            short: string;
        };
        Remarks: {
            text: string;
        };
        YHBatch: {
            text: string;
        };
        PersonID: {
            text: string;
            short: string;
        };
        FarmingCanProfit: {
            text: string;
            short: string;
        };
        RollInMarginBalance: {
            text: string;
            short: string;
        };
        YHFarmerContract: {
            text: string;
        };
        SerialNo: {
            text: string;
        };
        ChickenFarmID: {
            text: string;
        };
        ChickenFarmType: {
            text: string;
            poultry: string;
            hatchery: string;
            short: string;
        };
        MarketName: {
            text: string;
        };
        FullAddress: {
            text: string;
        };
        PersonId: {
            text: string;
        };
        ICount: {
            text: string;
        };
        title: string;
        TicketedPointID: {
            requestMessage: string;
        };
        Address: {
            text: string;
        };
        IsUse: {
            text: string;
            trueText: string;
            falseText: string;
        };
        Warehouse: {
            poultry: string;
            hatchery: string;
        };

        create: string;
        edit: string;
        delete: string;
        createPageTitle: string;
        editPageTitle: string;
        createPageTitle2: string;
        editPageTitle2: string;
        addressMessage: string;
    };
    yhImmunetipsSetting: {
        DataDate: {
            text: string;
        };
        FarmingPriceID: {
            text: string;
        };
        Number: {
            text: string;
        };
        AccountMonth: {
            text: string;
        };
        YhName: {
            text: string;
            short: string;
        };
        Remarks: {
            text: string;
        };
        YHBatch: {
            text: string;
        };
        PersonID: {
            text: string;
            short: string;
        };
        FarmingCanProfit: {
            text: string;
            short: string;
        };
        RollInMarginBalance: {
            text: string;
            short: string;
        };
        YHFarmerContract: {
            text: string;
        };
        SerialNo: {
            text: string;
        };
        ChickenFarmID: {
            text: string;
        };
        ChickenFarmType: {
            text: string;
            poultry: string;
            hatchery: string;
            short: string;
        };
        MarketName: {
            text: string;
        };
        FullAddress: {
            text: string;
        };
        PersonId: {
            text: string;
        };
        ICount: {
            text: string;
        };
        title: string;
        TicketedPointID: {
            requestMessage: string;
        };
        Address: {
            text: string;
        };
        IsUse: {
            text: string;
            trueText: string;
            falseText: string;
        };
        Warehouse: {
            poultry: string;
            hatchery: string;
        };
        create: string;
        edit: string;
        delete: string;
    };
    Patrolrecord: {
        title: string;
        NumericalOrder: {
            text: string;
        };
        PersonID: {
            text: string;
            requiredMessage: string;
        };
        HenhouseID: {
            text: string;
            requiredMessage: string;
        };
        Packages: {
            text: string;
            requiredMessage: string;
        };
        FeedWarehouseID: {
            text: string;
            requiredMessage: string;
        };
        Quantity: {
            text: string;
            requiredMessage: string;
        };
        TotalQuantity: {
            text: string;
            requiredMessage: string;
        };
        CullQuantity: {
            text: string;
            requiredMessage: string;
        };
        DeathQuantity: {
            text: string;
            requiredMessage: string;
        };
        MinDateData: {
            text: string;
        };
        MaxDateData: {
            text: string;
        };
        isbegin: {
            text: string;
        };
        Number: {
            text: string;
        };
        DataDate: {
            text: string;
            requiredMessage: string;
        };
        DateDateDetail: {
            text: string;
            requiredMessage: string;
        };
        ChickenFarmID: {
            text: string;
            requiredMessage: string;
        };
        YHFarmerID: {
            text: string;
            requiredMessage: string;
        };
        YHBatch: {
            text: string;
            requiredMessage: string;
        };
        SupplierID: {
            text: string;
            requiredMessage: string;
        };
        WarehouseID: {
            text: string;
            requiredMessage: string;
        };
        ChickenType: {
            text: string;
        };
        BreedName: {
            text: string;
        };
        DaysOld: {
            text: string;
        };
        FreightFor: {
            text: string;
            requiredMessage: string;
        };
        createPageTitle: string;
        editPageTitle: string;
    };
    PatrolrecordDetail: {
        DataDate: {
            text: string;
            required: string;
        };
        DaysOld: {
            text: string;
        };
        DeathCullRemarks: {
            text: string;
        };
        Specification: {
            text: string;
        };
        bIsStandardPack: {
            text: string;
        };
        StandardPack: {
            text: string;
        };
        HenhouseID: {
            text: string;
            required: string;
        };
        HenHouseName: {
            text: string;
            required: string;
        };
        FeedRemarks: {
            text: string;
        };
        Remarks: {
            text: string;
        };
        MeasureUnitName: {
            text: string;
            required: string;
        };
        ProductBatchID: {
            text: string;
            required: string;
        };
        ProductName: {
            text: string;
            required: string;
        };
        HatchBatchID: {
            text: string;
        };
        Packages: {
            text: string;
            required: string;
            message: string;
            patternMessage: string;
        };
        Quantity: {
            text: string;
            required: string;
            message: string;
            patternMessage: string;
        };
        FarmID: {
            text: string;
            required: string;
            message: string;
            patternMessage: string;
        };
        ValueQuantity: {
            text: string;
            required: string;
            message: string;
            patternMessage: string;
        };
        UnitPrice: {
            text: string;
            required: string;
            message: string;
            patternMessage: string;
        };
        BreedingID: {
            text: string;
        };
        Debeaking: {
            text: string;
        };
        ImmuneSubjectID: {
            text: string;
        };
        AmountTotal: {
            text: string;
            required: string;
            message: string;
            patternMessage: string;
        };
        BatchID: {
            text: string;
        };
        createPageTitle: string;
        editPageTitle: string;
    };
    yhmaterialsettingsSetting: {
        DataDate: {
            text: string;
        };
        FarmingPriceID: {
            text: string;
        };
        Number: {
            text: string;
        };
        EffectDate: {
            text: string;
        };
        YhName: {
            text: string;
            short: string;
        };
        Remarks: {
            text: string;
        };
        YHBatch: {
            text: string;
        };
        PersonID: {
            text: string;
            short: string;
        };
        FarmingCanProfit: {
            text: string;
            short: string;
        };
        RollInMarginBalance: {
            text: string;
            short: string;
        };
        YHFarmerContract: {
            text: string;
        };
        SerialNo: {
            text: string;
        };
        ChickenFarmID: {
            text: string;
        };
        ChickenFarmType: {
            text: string;
            poultry: string;
            hatchery: string;
            short: string;
        };
        MarketName: {
            text: string;
        };
        FullAddress: {
            text: string;
        };
        PersonId: {
            text: string;
        };
        ICount: {
            text: string;
        };
        title: string;
        TicketedPointID: {
            requestMessage: string;
        };
        Address: {
            text: string;
        };
        IsUse: {
            text: string;
            trueText: string;
            falseText: string;
        };
        Warehouse: {
            poultry: string;
            hatchery: string;
        };
        create: string;
        edit: string;
        delete: string;
    };
    YhDrugApplication: {
        title: string;
        NumericalOrder: {
            text: string;
        };
        Symptom: {
            text: string;
        };
        Diagnose: {
            text: string;
        };
        PersonID: {
            text: string;
            requiredMessage: string;
        };
        Abstract: {
            text: string;
            requiredMessage: string;
        };
        OutWarehouse: {
            text: string;
            requiredMessage: string;
        };
        InWarehouse: {
            text: string;
            requiredMessage: string;
        };
        Driver: {
            text: string;
            requiredMessage: string;
        };
        TotalQuantity: {
            text: string;
            requiredMessage: string;
        };
        ConfirmStatus: {
            text: string;
            requiredMessage: string;
        };
        ChickenSource: {
            text: string;
            requiredMessage: string;
        };
        Number: {
            text: string;
        };
        DataDate: {
            text: string;
            requiredMessage: string;
        };
        ChickenFarmID: {
            text: string;
            requiredMessage: string;
        };
        OldYHFarmerID: {
            text: string;
            requiredMessage: string;
        };
        YHFarmerID: {
            text: string;
            requiredMessage: string;
        };
        OldYHFarmerContract: {
            text: string;
            requiredMessage: string;
        };
        OrderingType: {
            text: string;
            requiredMessage: string;
        };
        OldSerialNo: {
            text: string;
            requiredMessage: string;
        };
        SerialNo: {
            text: string;
            requiredMessage: string;
        };
        YHBatch: {
            text: string;
            requiredMessage: string;
        };
        TransferReason: {
            text: string;
            requiredMessage: string;
        };
        ChickenType: {
            text: string;
        };
        isbegin: {
            text: string;
        };
        BreedingName: {
            text: string;
        };
        DaysOld: {
            text: string;
        };
        CurrentInventory: {
            text: string;
        };
        FreightFor: {
            text: string;
            requiredMessage: string;
        };
        createPageTitle: string;
        editPageTitle: string;
    };
    YhDrugApplicationDetail: {
        HenhouseID: {
            text: string;
            required: string;
        };
        Vendor: {
            text: string;
        };
        ProcessName: {
            text: string;
        };
        ProcessNo: {
            text: string;
        };
        ImmuneSubjectName: {
            text: string;
        };
        DrugsWay: {
            text: string;
        };
        CommonName: {
            text: string;
        };
        MeasureUnitName: {
            text: string;
            required: string;
        };
        ProductBatchID: {
            text: string;
            required: string;
        };
        ProductName: {
            text: string;
            required: string;
        };
        HatchBatchID: {
            text: string;
        };
        DonateQuantity: {
            text: string;
            required: string;
            message: string;
            patternMessage: string;
        };
        TotalQuantity: {
            text: string;
            required: string;
            message: string;
            patternMessage: string;
        };
        WarehouseID: {
            text: string;
        };
        ValueQuantity: {
            text: string;
            required: string;
            message: string;
            patternMessage: string;
        };
        UnitPrice: {
            text: string;
            required: string;
            message: string;
            patternMessage: string;
        };
        BreedingID: {
            text: string;
        };
        DrugMethod: {
            text: string;
        };
        Quantity: {
            text: string;
        };
        Remarks: {
            text: string;
        };
        BatchID: {
            text: string;
        };
        createPageTitle: string;
        editPageTitle: string;
    };
}
